ALTER TABLE camp ADD COLUMN coupons_allowed BOOLEAN DEFAULT TRUE;
UPDATE camp SET coupons_allowed = TRUE WHERE coupons_allowed IS NULL;

