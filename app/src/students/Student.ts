export interface StudentData {
  name: string;
  grade_level: number;
}

export interface Student extends StudentData {
  id: number;
}

export const CACHE_KEY_STUDENTS = ["students"];
