import create from "../../services/http-service";

export interface Program {
  id: number;
  title: string;
  grade_range: number[];
  tags: string;
  description: string;
}

export default create<Program>("/programs");
