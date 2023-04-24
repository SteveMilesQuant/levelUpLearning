import create from "../../services/http-service";

export interface Level {
  id: number;
  list_index: number;
  title: string;
  description: string;
}

export default (programId: number) =>
  create<Level>("/programs/" + programId + "/levels");
