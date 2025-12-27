use std::path::PathBuf;

use async_trait::async_trait;
use microsandbox_utils::{EXTRACTED_LAYER_SUFFIX, LAYERS_SUBDIR, env};
use oci_spec::image::Digest;

/// Result of downloading an image.
pub enum ImageLayerBlob {
    /// The layer was downloaded successfully to the provided path.
    Downloaded(Digest, PathBuf),

    /// The layer already exists in the global layer directory.
    ExistsInGlobalCache(Digest),
}

impl ImageLayerBlob {
    /// Returns the path to the downloaded layer. If the layer already exists in the global layer directory,
    /// returns None.
    pub fn download_path(&self) -> Option<PathBuf> {
        match self {
            ImageLayerBlob::Downloaded(_, path) => Some(path.clone()),
            ImageLayerBlob::ExistsInGlobalCache(_) => None,
        }
    }
}

/// Trait defining methods for interacting with on-disk image layers.
#[async_trait]
pub trait GlobalLayerOps {
    /// Checks if a layer exists on disk.
    ///
    /// # Arguments
    ///
    /// * `digest` - The digest of the layer to check
    ///
    /// # Returns
    ///
    /// Returns `true` if the layer exists, `false` otherwise.
    async fn get_layer(&self, digest: &Digest) -> Option<PathBuf>;
}

/// Perform operation against the directory where layers are stored
pub(crate) struct GlobalLayerCache {
    layers_dir: PathBuf,
}

impl Default for GlobalLayerCache {
    fn default() -> Self {
        Self {
            layers_dir: env::get_microsandbox_home_path().join(LAYERS_SUBDIR),
        }
    }
}

#[async_trait]
impl GlobalLayerOps for GlobalLayerCache {
    async fn get_layer(&self, digest: &Digest) -> Option<PathBuf> {
        let path = self
            .layers_dir
            .join(format!("{digest}.{EXTRACTED_LAYER_SUFFIX}"));

        if !path.exists() {
            return None;
        }

        // if there's at least one file in that specific layer directory, it means the layer already exists
        if let Ok(mut read_dir) = tokio::fs::read_dir(&path).await {
            if let Ok(Some(_)) = read_dir.next_entry().await {
                return Some(path);
            }
        }

        None
    }
}
