import create from "../services/http-service";
import { CampData, Camp } from "./Camp";

export const studentCampService = (studentId: number) =>
  create<CampData, Camp>("/students/" + studentId + "/camps");

export const scheduleCampService = create<CampData, Camp>("/schedule");

export default create<CampData, Camp>("/camps");
