export interface StudentData {
  name: string;
  grade_level: number;
}

export interface Student extends StudentData {
  id: number;
}
