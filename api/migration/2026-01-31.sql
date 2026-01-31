ALTER TABLE camp ADD COLUMN single_day_only BOOLEAN DEFAULT FALSE;
UPDATE camp SET single_day_only = FALSE WHERE single_day_only IS NULL;

ALTER TABLE camp ADD COLUMN enroll_full_day_allowed BOOLEAN DEFAULT TRUE;
UPDATE camp SET enroll_full_day_allowed = TRUE WHERE enroll_full_day_allowed IS NULL;

ALTER TABLE camp ADD COLUMN enroll_half_day_allowed BOOLEAN DEFAULT FALSE;
UPDATE camp SET enroll_half_day_allowed = FALSE WHERE enroll_half_day_allowed IS NULL;

ALTER TABLE camp ADD COLUMN half_day_cost FLOAT;
