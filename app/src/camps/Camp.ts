import { Program } from "../programs";
import { User } from "../users";

export interface CampData {
  program_id: number;
  primary_instructor_id: number;
  is_published: boolean;
  daily_start_time?: string;
  daily_end_time?: string;
  dates?: string[];
}

export interface Camp extends CampData {
  id: number;
  program: Program;
  primary_instructor: User;
}

export const CACHE_KEY_CAMPS = ["camps"];
