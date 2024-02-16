ALTER TABLE payment_record ADD COLUMN coupon_id INT;
ALTER TABLE payment_record ADD CONSTRAINT fk_coupon_id FOREIGN KEY (coupon_id) REFERENCES coupon(id);