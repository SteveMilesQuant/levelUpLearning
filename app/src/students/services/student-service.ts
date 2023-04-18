import { Camp } from "../../camps/services/camp-service";
import create from "../../services/http-service";

export interface Student {
  id: number;
  name: string;
  grade_level: number;
}

export const studentCampService = (student: Student) =>
  create<Camp>("/students/" + student.id + "/camps");

export default create<Student>("/students");
