CREATE TABLE IF NOT EXISTS gallery_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_path TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    source TEXT NOT NULL DEFAULT 'manual',
    source_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_published_order
    ON gallery_items (is_published, sort_order, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_gallery_items_source_id
    ON gallery_items (source, source_id)
    WHERE source_id IS NOT NULL;
