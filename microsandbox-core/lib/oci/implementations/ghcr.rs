use std::{
    ops::RangeBounds,
    path::{Path, PathBuf},
};

use async_trait::async_trait;
use bytes::Bytes;
use futures::{future, stream::BoxStream, StreamExt};
use getset::{Getters, Setters};
use microsandbox_utils::{env, EXTRACTED_LAYER_SUFFIX, LAYERS_SUBDIR};
use oci_spec::image::{Digest, ImageConfiguration, ImageIndex, ImageManifest, Platform};
use reqwest::Client;
use reqwest_middleware::{ClientBuilder, ClientWithMiddleware};
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Sqlite};
use thiserror::Error;
use tokio::{
    fs::{self, OpenOptions},
    io::AsyncWriteExt,
};

use crate::{
    management::db,
    oci::{OciRegistryPull, ReferenceSelector},
    utils, MicrosandboxError, MicrosandboxResult,
};

#[cfg(feature = "cli")]
use indicatif::{ProgressBar, ProgressStyle};
#[cfg(feature = "cli")]
use microsandbox_utils::term::{self, MULTI_PROGRESS};

/// Ghcr is a client for interacting with Github's Package (Registry) HTTP API v2.
/// It handles authentication, image manifest retrieval, and blob fetching.
///
/// [See OCI distribution specification for more details on the manifest schema][OCI Distribution Spec]
///
/// [See Github Registry API for more details on the API][Github Registry API]
///
/// [OCI Distribution Spec]: https://distribution.github.io/distribution/spec/manifest-v2-2/#image-manifest-version-2-schema-2
/// [Github Container Registry (Package) API]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
#[derive(Debug, Getters, Setters)]
#[getset(get = "pub with_prefix", set = "pub with_prefix")]
pub struct Ghcr {
    /// The HTTP client used to make requests to the Github Container registry.
    client: ClientWithMiddleware,
    /// The directory where image layers are downloaded.
    layer_download_dir: PathBuf,
    /// The database where image configurations, indexes, and manifests are stored.
    oci_db: Pool<Sqlite>,
}

/// Stores authentication credentials obtained from the Github Container Registry, including tokens and expiration details.
#[derive(Debug, Serialize, Deserialize)]
pub struct GhrcAuthMaterial {
    /// The token used to authenticate the requests to the Github Container Registry
    token: String,
}

/// Represents a response from the Github Container registry, which could either be successful (`Ok`) or an error (`Error`).
#[derive(Debug, Deserialize, Serialize)]
#[serde(untagged)]
pub enum GhcrRegistryResponse<T> {
    /// Represents a successful response from the Github Container Registry.
    Ok(T),
    /// Represents an error response from the Github Container Registry.
    Error(GhcrRegistryResponseError),
}

/// Represents an error response from the Github Container registry, including detailed error messages.
#[derive(Debug, Deserialize, Serialize, Error)]
#[error("Github registry error: {errors}")]
pub struct GhcrRegistryResponseError {
    errors: serde_json::Value,
}

/// Endpoint for acquiring authentication tokens, as described in the Github Container Registry authentication workflow.
const GHCR_AUTH_REALM: &str = "https://ghcr.io/token";

/// Base URL for Github Container Registry API, used for accessing image manifests, layers, and other registry operations.
const GHCR_REGISTRY_URL: &str = "https://ghcr.io";

/// Domain name for the Github Container Registry.
const GHCR_REGISTRY_DOMAIN: &str = "ghcr.io";

/// The MIME type for Github Container Registry v2 (OCI format) manifests, used to identify the format of the manifest data.
const GHCR_MANIFEST_LIST_MIME_TYPE: &str = "application/vnd.oci.image.manifest.v1+json";

/// The MIME type for Github Container Registry v2 (OCI format) configuration blobs, used to identify the format of the configuration blob data.
const GHCR_CONFIG_MIME_TYPE: &str = "application/vnd.oci.container.image.v1+json";

/// Spinner message used for downloading layers.
const DOWNLOAD_LAYER_MSG: &str = "Download layers";

impl Ghcr {
    /// Creates a new Github Container Registry client with the specified image download path and OCI database path.
    ///
    /// ## Arguments
    ///
    /// * `layer_download_dir` - The directory where downloaded image layers will be stored
    /// * `oci_db_path` - The path to the SQLite database that stores OCI-related metadata
    pub async fn new(
        layer_download_dir: impl Into<PathBuf>,
        oci_db_path: impl AsRef<Path>,
    ) -> MicrosandboxResult<Self> {
        let retry_policy = ExponentialBackoff::builder().build_with_max_retries(3);
        let client_builder = ClientBuilder::new(Client::new());
        let client = client_builder
            .with(RetryTransientMiddleware::new_with_policy(retry_policy))
            .build();

        Ok(Self {
            client,
            layer_download_dir: layer_download_dir.into(),
            oci_db: db::get_or_create_pool(oci_db_path.as_ref(), &db::OCI_DB_MIGRATOR).await?,
        })
    }

    async fn get_auth_credentials(
        &self,
        repository: &str,
        service: &str,
        scopes: &[&str],
    ) -> MicrosandboxResult<GhrcAuthMaterial> {
        let request = self
            .client
            .get(GHCR_AUTH_REALM)
            .query(&[
                ("service", service),
                (
                    "scope",
                    format!("repository:{}:{}", repository, scopes.join(",")).as_str(),
                ),
            ])
            .build()?;

        let response = self.client.execute(request).await?;
        let auth_credentials = response.json::<GhrcAuthMaterial>().await?;

        Ok(auth_credentials)
    }

    /// Downloads a blob from the registry, supports download resumption if the file already partially exists.
    ///
    /// Returns a tuple (MicrosandboxResult<()>, bool) where the boolean indicates whether a download
    /// actually occurred (true) or was skipped because the file already exists (false).
    pub async fn download_image_blob(
        &self,
        repository: &str,
        digest: &Digest,
        download_size: u64,
    ) -> MicrosandboxResult<bool> {
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

        let download_path = self.layer_download_dir.join(digest.to_string());

        // First, check if the extracted layer directory already exists and is not empty
        // Get the microsandbox home path and layers directory
        let microsandbox_home_path = env::get_microsandbox_home_path();
        let layers_dir = microsandbox_home_path.join(LAYERS_SUBDIR);
        let extracted_layer_path =
            layers_dir.join(format!("{}.{}", digest.to_string(), EXTRACTED_LAYER_SUFFIX));

        // Check if extracted directory exists and has content
        if extracted_layer_path.exists() {
            match fs::read_dir(&extracted_layer_path).await {
                Ok(mut read_dir) => {
                    if let Ok(Some(_)) = read_dir.next_entry().await {
                        // Extracted layer exists and contains at least one file
                        tracing::info!(
                            "extracted layer already exists: {}, skipping download",
                            extracted_layer_path.display()
                        );
                        return Ok(false); // Return false to indicate no download occurred
                    }
                }
                Err(e) => {
                    tracing::warn!("error checking extracted layer directory: {}", e);
                    // Continue with download if we can't read the directory
                }
            }
        }

        // Ensure the destination directory exists
        if let Some(parent) = download_path.parent() {
            fs::create_dir_all(parent).await?;
        }

        // Get the size of the already downloaded file if it exists
        let downloaded_size = self.get_downloaded_file_size(digest);

        // Open the file for writing, create if it doesn't exist
        let mut file = if downloaded_size == 0 {
            tracing::info!("layer {} does not exist, downloading", digest);
            OpenOptions::new()
                .create(true)
                .truncate(true)
                .write(true)
                .open(&download_path)
                .await?
        } else if downloaded_size < download_size {
            tracing::info!("layer {} exists, but is incomplete, downloading", digest);
            OpenOptions::new().append(true).open(&download_path).await?
        } else {
            tracing::info!(
                "file already exists skipping download: {}",
                download_path.display()
            );
            return Ok(false); // Return false to indicate no download occurred
        };

        let mut stream = self
            .fetch_image_blob(repository, digest, downloaded_size..)
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
                    "({repository}:{digest}) file hash {actual_hash} does not match expected hash {expected_hash}",
                )));
        }

        Ok(true) // Return true to indicate a download occurred
    }

    fn get_downloaded_file_size(&self, digest: &Digest) -> u64 {
        let download_path = self.layer_download_dir.join(digest.to_string());
        // If the file does not exist, return 0 indicating no bytes have been downloaded
        if !download_path.exists() {
            return 0;
        }

        download_path.metadata().unwrap().len()
    }
}

#[async_trait]
impl OciRegistryPull for Ghcr {
    async fn pull_image(
        &self,
        repository: &str,
        selector: ReferenceSelector,
    ) -> MicrosandboxResult<()> {
        #[cfg(feature = "cli")]
        let fetch_details_spinner =
            term::create_spinner("fetching image details".to_string(), None, None);

        let index = self.fetch_index(repository, selector.clone()).await?;

        let total_size: i64 = index.manifests().iter().map(|m| m.size() as i64).sum();
        let reference = match &selector {
            ReferenceSelector::Tag { tag, digest } => {
                let digest_part = digest
                    .as_ref()
                    .map(|d| format!("@{}:{}", d.algorithm(), d.digest()))
                    .unwrap_or_default();
                format!("{tag}{digest_part}")
            }
            ReferenceSelector::Digest(digest) => {
                format!("@{}:{}", digest.algorithm(), digest.digest())
            }
        };

        let image_id = db::save_or_update_image(&self.oci_db, &reference, total_size).await?;

        let platform = Platform::default();
        let index_id = db::save_index(&self.oci_db, image_id, &index, Some(&platform)).await?;

        let manifest = self.fetch_ghcr_manifest(repository, &reference).await?;

        let manifest_id =
            db::save_manifest(&self.oci_db, image_id, Some(index_id), &manifest).await?;

        let config = self
            .fetch_config(repository, manifest.config().digest())
            .await?;

        db::save_config(&self.oci_db, manifest_id, &config).await?;
        #[cfg(feature = "cli")]
        fetch_details_spinner.finish();
        let layers = manifest.layers();

        #[cfg(feature = "cli")]
        let download_layers_sp = term::create_spinner(
            DOWNLOAD_LAYER_MSG.to_string(),
            None,
            Some(layers.len() as u64),
        );

        // Download layers concurrently and save to database
        let layer_futures: Vec<_> = layers
            .iter()
            .zip(config.rootfs().diff_ids())
            .map(|(layer_desc, diff_id)| async {
                // Download the layer if it doesn't exist
                // Check if the layer was actually downloaded
                let layer_downloaded = self
                    .download_image_blob(repository, layer_desc.digest(), layer_desc.size())
                    .await?;

                #[cfg(feature = "cli")]
                download_layers_sp.inc(1);

                // Get or create layer record in database
                let layer_id = if layer_downloaded {
                    tracing::info!(
                        "Layer {} was downloaded, saving to database",
                        layer_desc.digest()
                    );

                    // Save new layer metadata to database
                    db::save_or_update_layer(
                        &self.oci_db,
                        &layer_desc.media_type().to_string(),
                        &layer_desc.digest().to_string(),
                        layer_desc.size() as i64,
                        diff_id,
                    )
                    .await?
                } else {
                    tracing::info!(
                        "Layer {} already exists, finding in database or creating record",
                        layer_desc.digest()
                    );

                    // Try to find existing layer in database by digest
                    let layers =
                        db::get_layers_by_digest(&self.oci_db, &[layer_desc.digest().to_string()])
                            .await?;

                    if let Some(layer) = layers.first() {
                        // Layer exists in database, use its ID
                        layer.id
                    } else {
                        // Layer exists on disk but not in database, create record
                        db::save_or_update_layer(
                            &self.oci_db,
                            &layer_desc.media_type().to_string(),
                            &layer_desc.digest().to_string(),
                            layer_desc.size() as i64,
                            diff_id,
                        )
                        .await?
                    }
                };

                // Always link the layer to the manifest
                db::save_manifest_layer(&self.oci_db, manifest_id, layer_id).await?;

                Ok::<_, MicrosandboxError>(())
            })
            .collect();

        // Wait for all layers to download and save
        for result in future::join_all(layer_futures).await {
            result?;
        }

        #[cfg(feature = "cli")]
        download_layers_sp.finish();

        Ok(())
    }

    async fn fetch_index(
        &self,
        _repository: &str,
        _selector: ReferenceSelector,
    ) -> MicrosandboxResult<ImageIndex> {
        Ok(ImageIndex::default())
    }

    async fn fetch_ghcr_manifest(
        &self,
        repository: &str,
        reference: &str,
    ) -> MicrosandboxResult<ImageManifest> {
        let token = self
            .get_auth_credentials(repository, GHCR_REGISTRY_DOMAIN, &["pull"])
            .await?
            .token;

        let request = self
            .client
            .get(format!(
                "{}/v2/{}/manifests/{}",
                GHCR_REGISTRY_URL, repository, reference
            ))
            .bearer_auth(&token)
            .header("Accept", GHCR_MANIFEST_LIST_MIME_TYPE)
            .build()?;
        let response = self.client.execute(request).await?;
        let manifest = response
            .json::<GhcrRegistryResponse<ImageManifest>>()
            .await?;

        match manifest {
            GhcrRegistryResponse::Ok(manifest) => Ok(manifest),
            GhcrRegistryResponse::Error(err) => Err(err.into()),
        }
    }

    async fn fetch_manifest(
        &self,
        _repository: &str,
        _digest: &Digest,
    ) -> MicrosandboxResult<ImageManifest> {
        unimplemented!()
    }

    async fn fetch_config(
        &self,
        repository: &str,
        digest: &Digest,
    ) -> MicrosandboxResult<ImageConfiguration> {
        let token = self
            .get_auth_credentials(repository, GHCR_REGISTRY_DOMAIN, &["pull"])
            .await?
            .token;

        let request = self
            .client
            .get(format!(
                "{}/v2/{}/blobs/{}",
                GHCR_REGISTRY_URL, repository, digest
            ))
            .bearer_auth(token)
            .header("Accept", GHCR_CONFIG_MIME_TYPE)
            .build()?;

        let response = self.client.execute(request).await?;

        let config = response
            .json::<GhcrRegistryResponse<ImageConfiguration>>()
            .await?;

        match config {
            GhcrRegistryResponse::Ok(config) => Ok(config),
            GhcrRegistryResponse::Error(err) => Err(err.into()),
        }
    }

    async fn fetch_image_blob(
        &self,
        repository: &str,
        digest: &Digest,
        range: impl RangeBounds<u64> + Send,
    ) -> MicrosandboxResult<BoxStream<'static, MicrosandboxResult<Bytes>>> {
        let (start, end) = utils::convert_bounds(range);
        let end = if end == u64::MAX {
            "".to_string()
        } else {
            end.to_string()
        };

        tracing::info!("fetching blob: {digest} {start}-{end}");

        let token = self
            .get_auth_credentials(repository, GHCR_REGISTRY_DOMAIN, &["pull"])
            .await?
            .token;

        let request = self
            .client
            .get(format!(
                "{}/v2/{}/blobs/{}",
                GHCR_REGISTRY_URL, repository, digest
            ))
            .bearer_auth(token)
            .header("Accept", "application/vnd.oci.image.rootfs.diff.tar.gzip")
            .header("Range", format!("bytes={start}-{end}"))
            .build()?;

        let response = self.client.execute(request).await?;
        let stream = response
            .bytes_stream()
            .map(|item| item.map_err(|e| e.into()));

        Ok(stream.boxed())
    }
}
