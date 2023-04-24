import create from "../../services/http-service";

export interface Student {
  id: number;
  name: string;
  grade_level: number;
}

export default create<Student>("/students");
