import create from "../services/http-service";
import { LevelScheduleData, LevelSchedule } from "./LevelSchedule";

export default (campId: number) =>
  create<LevelScheduleData, LevelSchedule>("/camps/" + campId + "/levels");
