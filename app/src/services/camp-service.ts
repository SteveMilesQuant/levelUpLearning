import create from "./http-service";
import { Program } from "./program-service";

export interface Camp {
  id: number;
  program_id: number;
  program: Program;
}

export const campProgramService = (camp: Camp) => {
  return create<Camp>("/camps/" + camp.id + "/programs" + camp.program_id);
};

export default create<Camp>("/camps");
