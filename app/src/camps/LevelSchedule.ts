import { Level } from "../programs";

export interface LevelScheduleData {
  start_time: string;
  end_time: string;
}

export interface LevelSchedule extends LevelScheduleData {
  id: number;
  level: Level;
}

export const CACHE_KEY_LEVEL_SCHEDULES = ["levels"];
