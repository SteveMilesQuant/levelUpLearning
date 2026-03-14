CREATE TABLE student_form (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL UNIQUE,
    child_school TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    parent_email TEXT,
    parent_phone TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    allergies TEXT NOT NULL,
    pickup_persons TEXT NOT NULL,
    additional_info TEXT,
    photo_permission BOOLEAN NOT NULL,
    referral_source TEXT,
    updated_at DATETIME,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);
