import create from "../../services/http-service";

export interface StudentData {
  name: string;
  grade_level: number;
}

export interface Student extends StudentData {
  id: number;
}

export default create<StudentData, Student>("/students");
