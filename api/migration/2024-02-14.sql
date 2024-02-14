ALTER TABLE payment_record ADD user_id INT NOT NULL DEFAULT 1;
ALTER TABLE payment_record ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user(id);