use oci_spec::image::Platform;
use sqlx::{Pool, Sqlite};

use crate::{
    management::db::{self, OCI_DB_MIGRATOR},
    oci::{GlobalLayerCache, Registry},
};
use tempfile::TempDir;

/// Mock the registry client and sqlite db.
pub(crate) async fn mock_registry_and_db() -> (Registry<GlobalLayerCache>, Pool<Sqlite>, TempDir) {
    let temp_dir = TempDir::new().unwrap();
    let download_dir = temp_dir.path().join("download");
    let db_path = temp_dir.path().join("db");
    let db = db::get_or_create_pool(&db_path, &OCI_DB_MIGRATOR)
        .await
        .unwrap();

    OCI_DB_MIGRATOR.run(&db).await.unwrap();

    let platform = Platform::default();
    let layer_ops = GlobalLayerCache::default();
    let registry = Registry::new(download_dir, db.clone(), platform, layer_ops)
        .await
        .unwrap();
    (registry, db, temp_dir)
}
