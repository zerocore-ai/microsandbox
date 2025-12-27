use std::{path::PathBuf, str::FromStr};

use bytes::Bytes;
use futures::{StreamExt, future, stream::BoxStream};
use oci_client::{
    Client as OciClient,
    client::{BlobResponse, ClientConfig as OciClientConfig, Config as OciConfig, LayerDescriptor},
    config::ConfigFile as OciConfigFile,
    manifest::{ImageIndexEntry, OciImageManifest, OciManifest},
    secrets::RegistryAuth,
};
use oci_spec::image::{Digest, Platform};
use sqlx::{Pool, Sqlite};
use tokio::{
    fs::{self, OpenOptions},
    io::AsyncWriteExt,
};

use crate::{
    MicrosandboxError, MicrosandboxResult,
    management::db,
    oci::{GlobalLayerOps, ImageLayerBlob, Reference},
    utils,
};

#[cfg(feature = "cli")]
use indicatif::{ProgressBar, ProgressStyle};
#[cfg(feature = "cli")]
use microsandbox_utils::term::{self, MULTI_PROGRESS};

//--------------------------------------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------------------------------------

#[cfg(feature = "cli")]
/// Spinner message used for fetching image details.
const FETCH_IMAGE_DETAILS_MSG: &str = "Fetch image details";

#[cfg(feature = "cli")]
/// Spinner message used for downloading layers.
const DOWNLOAD_LAYER_MSG: &str = "Download layers";

pub(crate) const DOCKER_REFERENCE_TYPE_ANNOTATION: &str = "vnd.docker.reference.type";

//--------------------------------------------------------------------------------------------------
// Types
//--------------------------------------------------------------------------------------------------

/// DockerRegistry is a client for interacting with Docker's Registry HTTP API v2.
/// It handles authentication, image manifest retrieval, and blob fetching.
///
/// [See OCI distribution specification for more details on the manifest schema][OCI Distribution Spec]
///
/// [See Docker Registry API for more details on the API][Docker Registry API]
///
/// [OCI Distribution Spec]: https://distribution.github.io/distribution/spec/manifest-v2-2/#image-manifest-version-2-schema-2
/// [Docker Registry API]: https://distribution.github.io/distribution/spec/api/#introduction
pub struct Registry<GlobalCache: GlobalLayerOps> {
    client: OciClient,

    /// TODO (333): Support varying auth methods.
    auth: RegistryAuth,

    /// The directory where image layers are downloaded.
    pub(super) layer_download_dir: PathBuf,

    /// The database where image configurations, and manifests are stored.
    db: Pool<Sqlite>,

    /// Abstraction for interacting with the global microsandbox cache.
    global_cache: GlobalCache,
}

//--------------------------------------------------------------------------------------------------
// Methods
//--------------------------------------------------------------------------------------------------

impl<T> Registry<T>
where
    T: GlobalLayerOps + Send + Sync,
{
    /// Creates a new Docker Registry client with the specified image download path and OCI database path.
    ///
    /// ## Arguments
    ///
    /// * `layer_download_dir` - The directory where downloaded image layers will be stored
    /// * `db` - The database where image configurations, and manifests are stored
    /// * `platform` - The platform for which the image is being downloaded
    /// * `layer_ops` - The layer operations to use for managing image layers
    pub async fn new(
        layer_download_dir: impl Into<PathBuf>,
        db: Pool<Sqlite>,
        platform: Platform,
        layer_ops: T,
    ) -> MicrosandboxResult<Self> {
        let mut config = OciClientConfig::default();
        config.platform_resolver = Some(Box::new(move |manifests| {
            Self::resolve_digest_for_platform(platform.clone(), manifests)
        }));

        Ok(Self {
            client: OciClient::new(config),
            auth: RegistryAuth::Anonymous,
            layer_download_dir: layer_download_dir.into(),
            db,
            global_cache: layer_ops,
        })
    }

    /// Gets the path where a layer with the given digest should be downloaded.
    ///
    /// ## Arguments
    ///
    /// * `digest` - The digest of the layer to download
    fn get_digest_download_path(&self, digest: &Digest) -> PathBuf {
        self.layer_download_dir.join(digest.to_string())
    }

    /// Gets the size of a downloaded file if it exists.
    ///
    /// ## Arguments
    ///
    /// * `digest` - The digest of the layer to download
    fn get_downloaded_file_size(&self, digest: &Digest) -> u64 {
        let download_path = self.get_digest_download_path(digest);
        // If the file does not exist, return 0 indicating no bytes have been downloaded
        if !download_path.exists() {
            return 0;
        }

        download_path.metadata().unwrap().len()
    }

    /// Downloads a blob from the registry, supports download resumption if the file already partially exists.
    ///
    /// ## Arguments
    ///
    /// * `reference` - The reference to the repository and tag
    /// * `digest` - The digest of the layer to download
    /// * `download_size` - The size of the layer to download
    ///
    /// # Returns
    ///
    /// Returns `Ok(true)` if the download actually occurred; `Ok(false)` if the file already exists.
    pub async fn download_image_blob(
        &self,
        reference: &Reference,
        digest: &Digest,
        download_size: u64,
    ) -> MicrosandboxResult<ImageLayerBlob> {
        #[cfg(feature = "cli")]
        let progress_bar = {
            let pb = MULTI_PROGRESS.add(ProgressBar::new(download_size));
            let style = ProgressStyle::with_template(
                "{prefix:.bold.dim} {bar:40.green/green.dim} {bytes:.bold} / {total_bytes:.dim}",
            )
            .unwrap()
            .progress_chars("=+-");

            pb.set_style(style);
            // first 8 chars of sha part
            let digest_short = digest.digest().get(..8).unwrap_or("");
            pb.set_prefix(format!("{}", digest_short));
            pb.clone()
        };

        #[cfg(feature = "cli")]
        {
            // If we already have some bytes downloaded, reflect that on the progress bar.
            let downloaded_so_far = self.get_downloaded_file_size(digest);
            progress_bar.set_position(downloaded_so_far);
        }

        let download_path = self.get_digest_download_path(digest);

        // Ensure the destination directory exists
        if let Some(parent) = download_path.parent() {
            fs::create_dir_all(parent).await?;
        }

        // Check if the layer already exists in the global layer directory
        if self.global_cache.get_layer(digest).await.is_some() {
            tracing::info!("layer {} already exists, skipping download", digest);
            return Ok(ImageLayerBlob::ExistsInGlobalCache(digest.clone()));
        }

        // if the file already exists and is the same size, skip download
        let downloaded_size = self.get_downloaded_file_size(digest);
        if downloaded_size == download_size {
            tracing::info!("layer {} already exists, skipping download", digest);
            return Ok(ImageLayerBlob::Downloaded(digest.clone(), download_path));
        }

        // Open the file for writing, create if it doesn't exist
        let mut file = OpenOptions::new();
        let file = if downloaded_size == 0 {
            tracing::info!(?digest, "layer does not exist, downloading");
            file.create(true).truncate(true).write(true)
        } else {
            tracing::info!(?digest, "layer exists, but is incomplete, downloading");
            file.append(true)
        };

        let mut file = file.open(&download_path).await?;
        let mut stream = self
            .fetch_digest_blob(&reference, digest, downloaded_size, None)
            .await?;

        // Write the stream to the file
        while let Some(chunk) = stream.next().await {
            let bytes = chunk?;
            file.write_all(&bytes).await?;
            #[cfg(feature = "cli")]
            progress_bar.inc(bytes.len() as u64);
        }

        #[cfg(feature = "cli")]
        progress_bar.finish_and_clear();

        // Verify the hash of the downloaded file
        let algorithm = digest.algorithm();
        let expected_hash = digest.digest();
        let actual_hash = hex::encode(utils::get_file_hash(&download_path, algorithm).await?);

        // Delete the already downloaded file if the hash does not match
        if actual_hash != expected_hash {
            fs::remove_file(&download_path).await?;
            return Err(MicrosandboxError::ImageLayerDownloadFailed(format!(
                "({reference}:{digest}) file hash {actual_hash} does not match expected hash {expected_hash}",
            )));
        }

        Ok(ImageLayerBlob::Downloaded(digest.clone(), download_path))
    }

    /// Filters through all image index manifests and returns the digest of the
    /// manifest that matches the platform specified.
    ///
    /// ## Arguments
    ///
    /// * `platform` - The platform for which the image is being downloaded
    /// * `manifests` - The list of manifests for the image index
    ///
    /// # Returns
    ///
    /// Returns `Some(digest)` if a matching manifest is found; `None` otherwise.
    fn resolve_digest_for_platform(
        platform: Platform,
        manifests: &[ImageIndexEntry],
    ) -> Option<String> {
        manifests
            .iter()
            // First priority: match both OS and architecture
            .find(|m| {
                m.platform.as_ref().is_some_and(|p| {
                    p.os == *platform.os()    &&
                    p.architecture == *platform.architecture() &&
                    // Skip attestation manifests
                    !m.annotations.as_ref().is_some_and(|a| a.contains_key(DOCKER_REFERENCE_TYPE_ANNOTATION))
                })
            })
            // Second priority: match architecture only, if no Linux match found
            .or_else(|| {
                manifests.iter().find(|m| {
                    m.platform.as_ref().is_some_and(|p| {
                        p.architecture == *platform.architecture() &&
                        !m.annotations.as_ref().is_some_and(|a| a.contains_key(DOCKER_REFERENCE_TYPE_ANNOTATION))
                    })
                })
            })
            .map(|m| m.digest.clone())
    }

    /// Pulls an OCI image from the specified repository. This includes downloading
    /// the image manifest, fetching the image configuration, and downloading the image layers.
    ///
    /// The image can be selected either by tag or digest using the [`ReferenceSelector`] enum.
    pub(crate) async fn pull_image(
        &self,
        reference: &Reference,
    ) -> MicrosandboxResult<Vec<ImageLayerBlob>> {
        // Calculate total size and save image record
        #[cfg(feature = "cli")]
        let fetch_details_sp =
            term::create_spinner(FETCH_IMAGE_DETAILS_MSG.to_string(), None, None);

        let index = self.fetch_index(reference).await?;
        let size = match index {
            OciManifest::Image(m) => m.config.size,
            OciManifest::ImageIndex(m) => m.manifests.iter().map(|m| m.size).sum(),
        };
        let image_id = db::save_or_update_image(&self.db, &reference.as_db_key(), size).await?;

        // Fetch and save manifest
        let (manifest, config) = self.fetch_manifest_and_config(reference).await?;
        let manifest_id = db::save_manifest(&self.db, image_id, &manifest).await?;
        db::save_config(&self.db, manifest_id, &config).await?;

        #[cfg(feature = "cli")]
        fetch_details_sp.finish();

        #[cfg(feature = "cli")]
        let download_layers_sp = term::create_spinner(
            DOWNLOAD_LAYER_MSG.to_string(),
            None,
            Some(manifest.layers.len() as u64),
        );

        // Download layers concurrently and save to database
        let diffs = config.rootfs.diff_ids.iter();
        let layer_futures: Vec<_> = manifest
            .layers
            .iter()
            .zip(diffs)
            .map(|(layer, diff_id)| async {
                #[cfg(feature = "cli")]
                download_layers_sp.inc(1);

                let diff_id = diff_id.to_string();
                let digest = Digest::from_str(&layer.digest)?;
                let blob = self
                    .download_image_blob(&reference, &digest, layer.size as u64)
                    .await?;

                let db_layer_id = match &blob {
                    ImageLayerBlob::Downloaded(digest, path_buf) => {
                        tracing::info!(
                            ?digest,
                            ?path_buf,
                            "Layer was downloaded, saving to database"
                        );
                        None
                    }
                    ImageLayerBlob::ExistsInGlobalCache(digest) => {
                        tracing::info!(
                            ?digest,
                            "Layer exists in global cache. Checking database as well"
                        );
                        db::get_layer_by_digest(&self.db, &digest.to_string())
                            .await?
                            .map(|l| l.id)
                    }
                };

                let db_layer_id = match db_layer_id {
                    Some(layer_id) => layer_id,
                    None => {
                        db::save_or_update_layer(
                            &self.db,
                            &layer.media_type,
                            &layer.digest,
                            layer.size,
                            &diff_id,
                        )
                        .await?
                    }
                };

                // link the layer to the manifest
                db::save_manifest_layer(&self.db, manifest_id, db_layer_id).await?;
                Ok::<_, MicrosandboxError>(blob)
            })
            .collect();

        // Wait for all layers to download and save
        let layers = future::join_all(layer_futures)
            .await
            .into_iter()
            .collect::<Result<Vec<_>, _>>()?;

        #[cfg(feature = "cli")]
        download_layers_sp.finish();

        Ok(layers)
    }

    /// Fetches all available multi-platform manifests for the given reference.
    ///
    /// ## Argumebts
    ///
    /// * `reference` - The reference to the repository and tag
    ///
    /// ## Returns
    /// If the image reference has multi-platform support, [`OciManifest::ImageIndex`] is
    /// returned, otherwise, [`OciManifest::Image`].
    pub(crate) async fn fetch_index(
        &self,
        reference: &Reference,
    ) -> MicrosandboxResult<OciManifest> {
        let (index, _) = self.client.pull_manifest(reference, &self.auth).await?;
        Ok(index)
    }

    /// Fetches an single image manifest and config by its digest.
    ///
    /// ## Argumebts
    ///
    /// * `reference` - The reference to the repository and tag
    pub(crate) async fn fetch_manifest_and_config(
        &self,
        reference: &Reference,
    ) -> MicrosandboxResult<(OciImageManifest, OciConfigFile)> {
        let (manifest, _, config) = self
            .client
            .pull_manifest_and_config(reference, &self.auth)
            .await?;

        let config = OciConfig::oci_v1(config.as_bytes().to_vec(), manifest.annotations.clone());
        let config = OciConfigFile::try_from(config)?;
        Ok((manifest, config))
    }

    /// Fetches a image blob from the registry by its digest.
    ///
    /// ## Argumebts
    ///
    /// * `reference` - The reference to the repository and tag
    /// * `digest` - The digest of the layer to download
    /// * `offset` - The position in the entire blob to resume from.
    ///              If `0` is provided, reading would commence from first byte in the blob.
    /// * `length` - The number of bytes to fetch from the `offset`.
    ///              If `None`, it'd be read to the end.
    ///
    /// ## Returns
    /// Returns a stream of the blob for efficient processing.
    pub(crate) async fn fetch_digest_blob(
        &self,
        reference: &Reference,
        digest: &Digest,
        offset: u64,
        length: Option<u64>,
    ) -> MicrosandboxResult<BoxStream<'static, MicrosandboxResult<Bytes>>> {
        tracing::info!(
            "fetching blob: {digest} {offset}-{}",
            length.map(|l| l.to_string()).unwrap_or("end".to_string())
        );

        let layer = LayerDescriptor {
            digest: &digest.to_string(),
            urls: &None,
        };

        let stream = self
            .client
            .pull_blob_stream_partial(reference, &layer, offset, length)
            .await?;

        let stream = match stream {
            BlobResponse::Full(s) => s,
            BlobResponse::Partial(s) => s,
        };

        Ok(stream.stream.map(|r| r.map_err(Into::into)).boxed())
    }
}
