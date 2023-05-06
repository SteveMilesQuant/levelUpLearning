import { Program } from "../programs";
import { User } from "../services/user-service";

export interface CampData {
  program_id: number;
  primary_instructor_id: number;
}

export interface Camp extends CampData {
  id: number;
  program: Program;
  primary_instructor: User;
}

export const CACHE_KEY_CAMPS = ["camps"];
export const CACHE_KEY_SCHEDULE = ["schedule"];
