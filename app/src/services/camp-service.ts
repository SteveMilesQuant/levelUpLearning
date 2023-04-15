import create from "./http-service";
import { Program } from "./program-service";
import { User } from "./user-service";

export interface CampData {
  id: number;
  program_id: number;
  primary_instructor_id: number;
}

export interface Camp extends CampData {
  program?: Program;
  primary_instructor?: User;
}

export const campProgramService = (camp: Camp) => {
  return create<Camp>("/camps/" + camp.id + "/programs" + camp.program_id);
};

export default create<Camp>("/camps");
