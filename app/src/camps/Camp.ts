import { Program } from "../programs/Program";
import { User } from "../services/user-service";

export interface CampData {
  id: number;
  program_id: number;
  primary_instructor_id: number;
}

export interface Camp extends CampData {
  program: Program;
  primary_instructor: User;
}
