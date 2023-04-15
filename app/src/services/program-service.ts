import create from "./http-service";

export interface Program {
  id: number;
  title: string;
}

export default create<Program>("/programs");
