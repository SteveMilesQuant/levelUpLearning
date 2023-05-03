import { Level } from "../programs/Level";

export interface LevelScheduleData {
  start_time: Date;
  end_time: Date;
}

export interface LevelSchedule extends LevelScheduleData {
  id: number;
  level: Level;
}

export const CACHE_KEY_LEVEL_SCHEDULES = ["levels"];
