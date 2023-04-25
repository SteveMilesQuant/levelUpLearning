import create from "../../services/http-service";
import { Level } from "../../programs/services/level-service";

export interface LevelScheduleData {
  start_time: Date;
  end_time: Date;
}

export interface LevelSchedule extends LevelScheduleData {
  level: Level;
}

export default (campId: number) =>
  create<LevelScheduleData, LevelSchedule>("/camps/" + campId + "/levels");
