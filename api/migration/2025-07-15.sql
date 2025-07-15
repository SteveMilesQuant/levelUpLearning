ALTER TABLE payment_record ADD COLUMN total_cost INT;
ALTER TABLE payment_record ADD COLUMN disc_cost INT;

UPDATE payment_record
JOIN camp ON payment_record.camp_id = camp.id
SET payment_record.total_cost = camp.cost * 100,
    payment_record.disc_cost = payment_record.total_cost;

UPDATE payment_record
LEFT JOIN coupon ON payment_record.coupon_id = coupon.id
SET payment_record.disc_cost = payment_record.total_cost - coupon.discount_amount * 100
WHERE coupon.discount_type = 'dollars';

UPDATE payment_record
LEFT JOIN coupon ON payment_record.coupon_id = coupon.id
SET payment_record.disc_cost = payment_record.total_cost * (100- coupon.discount_amount) / 100
WHERE coupon.discount_type = 'percent';

