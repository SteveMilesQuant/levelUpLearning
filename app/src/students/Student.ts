import { Camp } from "../camps";

export interface StudentData {
  name: string;
  grade_level: number;
}

export interface Student extends StudentData {
  id: number;
  camps: Camp[];
}

export const CACHE_KEY_STUDENTS = ["students"];
