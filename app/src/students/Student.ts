import { Camp } from "../camps";
import { HalfDayType } from "../hooks/useEnrollments";
import { User } from "../users";

export interface StudentData {
  name: string;
  grade_level: number;
}

export interface StudentCamp extends Camp {
  half_day?: HalfDayType;
}

export interface Student extends StudentData {
  id: number;
  student_camps: StudentCamp[];
  guardians: User[];
}

export const CACHE_KEY_STUDENTS = ["students"];
