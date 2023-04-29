export interface ProgramData {
  title: string;
  grade_range: number[];
  tags: string;
  description: string;
}

export interface Program extends ProgramData {
  id: number;
}
