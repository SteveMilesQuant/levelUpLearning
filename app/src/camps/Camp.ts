import { Program } from "../programs";
import { User } from "../users";

export interface CampData {
  program_id: number;
  primary_instructor_id: number;
  is_published: boolean;
  location?: string;
  daily_start_time?: string;
  daily_end_time?: string;
  cost?: number;
  camp_type?: string;
  dates?: string[];
  enrollment_disabled?: boolean;
  capacity?: number;
  coupons_allowed?: boolean;
}

export interface Camp extends CampData {
  id: number;
  program: Program;
  primary_instructor: User;
  current_enrollment?: number;
}

export const CACHE_KEY_CAMPS = ["camps"];

export const CAMP_DATA_DEFAULTS = {
  program_id: -1,
  primary_instructor_id: -1,
  is_published: false,
  enrollment_disabled: false,
  capacity: 20,
  coupons_allowed: true,
} as CampData;

export const CAMP_CAPACITY_DISPLAY_THRESHOLD = 9;
