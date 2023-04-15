import create from "./http-service";

export interface Program {
  id: number;
  title: string;
  grade_range: number[];
  tags: string;
}

export default create<Program>("/programs");
