import create from "../../services/http-service";
import { Program } from "../../programs/services/program-service";
import { User } from "../../services/user-service";

export interface CampData {
  id: number;
  program_id: number;
  primary_instructor_id: number;
}

export interface Camp extends CampData {
  program?: Program;
  primary_instructor?: User;
}

export const studentCampService = (studentId: number) =>
  create<Camp>("/students/" + studentId + "/camps");

export const scheduleCampService = create<Camp>("/schedule");

export default create<Camp>("/camps");
