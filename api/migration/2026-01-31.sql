ALTER TABLE camp ADD COLUMN single_day_only BOOLEAN DEFAULT FALSE;
UPDATE camp SET single_day_only = FALSE WHERE single_day_only IS NULL;

ALTER TABLE camp ADD COLUMN enroll_full_day_allowed BOOLEAN DEFAULT TRUE;
UPDATE camp SET enroll_full_day_allowed = TRUE WHERE enroll_full_day_allowed IS NULL;

ALTER TABLE camp ADD COLUMN enroll_half_day_allowed BOOLEAN DEFAULT FALSE;
UPDATE camp SET enroll_half_day_allowed = FALSE WHERE enroll_half_day_allowed IS NULL;

ALTER TABLE camp ADD COLUMN daily_am_end_time TIME NULL;
ALTER TABLE camp ADD COLUMN daily_pm_start_time TIME NULL;

ALTER TABLE camp ADD COLUMN half_day_cost FLOAT;
ALTER TABLE payment_record ADD COLUMN half_day ENUM('AM','PM') NULL;
ALTER TABLE camp_x_students ADD COLUMN half_day ENUM('AM','PM') NULL;
