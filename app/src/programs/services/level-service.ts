import create from "../../services/http-service";

export interface LevelData {
  list_index: number;
  title: string;
  description: string;
}

export interface Level extends LevelData {
  id: number;
}

export default (programId: number) =>
  create<LevelData, Level>("/programs/" + programId + "/levels");
