import { Camp } from "../camps";
import { User } from "../users";

export interface StudentData {
  name: string;
  grade_level: number;
}

export interface Student extends StudentData {
  id: number;
  camps: Camp[];
  guardians: User[];
}

export const CACHE_KEY_STUDENTS = ["students"];
