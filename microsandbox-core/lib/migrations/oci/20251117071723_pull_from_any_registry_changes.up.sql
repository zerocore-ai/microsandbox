-- -- MySQL doesn't support dropping columns with foreign keys directly
-- -- So we create a new table, copy data, and rename it
-- -- Create new manifests table without index_id column
-- -- Before finally dropping the indexes table
CREATE TABLE IF NOT EXISTS manifests_new (
    id INTEGER PRIMARY KEY,
    image_id INTEGER NOT NULL,
    schema_version INTEGER NOT NULL,
    media_type TEXT NOT NULL,
    annotations_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);

-- Copy data from old table to new table
INSERT INTO
    manifests_new (
        id,
        image_id,
        schema_version,
        media_type,
        annotations_json,
        created_at,
        modified_at
    )
SELECT
    id,
    image_id,
    schema_version,
    media_type,
    annotations_json,
    created_at,
    modified_at
FROM
    manifests;

-- Drop the old table
DROP TABLE manifests;

-- Rename the new table
ALTER TABLE
    manifests_new RENAME TO manifests;

-- Recreate the image_id index
CREATE INDEX IF NOT EXISTS idx_manifests_image_id ON manifests(image_id);

-- Finally drop the indexes table
DROP TABLE IF EXISTS indexes;

-- -- -- add manifest_id column to layers table
-- ALTER TABLE
--     manifest_layers
-- ADD
--     COLUMN manifest_id INTEGER NOT NULL REFERENCES manifests(id) ON DELETE CASCADE;
-- CREATE INDEX IF NOT EXISTS idx_manifest_layers_manifest_id ON manifest_layers(manifest_id);