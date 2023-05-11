import { Program } from "../programs";
import { User } from "../users";

export interface CampData {
  program_id: number;
  primary_instructor_id: number;
}

export interface Camp extends CampData {
  id: number;
  program: Program;
  primary_instructor: User;
  is_published: boolean;
}

export const CACHE_KEY_CAMPS = ["camps"];
export const CACHE_KEY_SCHEDULE = ["schedule"];
