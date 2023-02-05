// Classes for sending down data to server
// Responses will be effectively these plus an ID

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
