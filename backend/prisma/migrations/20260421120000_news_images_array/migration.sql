-- Add new array column with default empty array
ALTER TABLE "News" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Backfill from "imagePath" (JSON-encoded string array) per-row, with a fallback
-- for malformed rows so the migration cannot fail mid-way.
DO $$
DECLARE
  r RECORD;
  v_images TEXT[];
BEGIN
  FOR r IN SELECT "id", "imagePath" FROM "News" LOOP
    BEGIN
      SELECT array_agg(elem)
      INTO v_images
      FROM jsonb_array_elements_text(r."imagePath"::jsonb) AS elem;
    EXCEPTION WHEN OTHERS THEN
      v_images := NULL;
    END;

    IF v_images IS NULL THEN
      IF r."imagePath" IS NULL OR r."imagePath" = '' THEN
        v_images := ARRAY[]::TEXT[];
      ELSE
        v_images := ARRAY[r."imagePath"];
      END IF;
    END IF;

    UPDATE "News" SET "images" = v_images WHERE "id" = r."id";
  END LOOP;
END $$;

-- Drop legacy column
ALTER TABLE "News" DROP COLUMN "imagePath";
