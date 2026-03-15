ALTER TABLE user ADD COLUMN pickup_persons_updated_at DATETIME NULL;
ALTER TABLE camp ADD COLUMN pickup_codes_generated BOOLEAN DEFAULT FALSE;
