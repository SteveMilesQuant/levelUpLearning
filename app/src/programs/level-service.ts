import create from "../services/http-service";
import { LevelData, Level } from "./Level";

export default (programId: number) =>
  create<LevelData, Level>("/programs/" + programId + "/levels");
