// Classes for sending down data to server
// Responses will be effectively these plus an ID

class UserData {
    constructor(full_name, email_address, phone_number, instructor_subjects, instructor_description) {
        this.full_name = full_name;
        this.email_address = email_address;
        this.phone_number = phone_number;
        this.instructor_subjects = instructor_subjects;
        this.instructor_description = instructor_description;
    }
}

class StudentData {
    constructor(name, birthdate, gradeLevel) {
        this.name = name;
        this.birthdate = birthdate;
        this.grade_level = gradeLevel;
    }
}

class ProgramData {
    constructor(title, tags, grade_range, description) {
        this.title = title;
        this.tags = tags;
        this.grade_range = grade_range;
        this.description = description;
    }
}

class LevelData {
    constructor(title, list_index, description) {
        this.title = title;
        this.list_index = list_index;
        this.description = description;
    }
}

class CampData {
    constructor(program_id, primary_instructor_id, is_published) {
        this.program_id = program_id;
        this.primary_instructor_id = primary_instructor_id;
        this.is_published = is_published;
    }
}

class LevelSchedule {
    constructor(start_time, end_time) {
        this.start_time = start_time;
        this.end_time = end_time;
        // Exception to the rule: response version of LevelSchedule is identical to this (and does not include an id)
    }
}


