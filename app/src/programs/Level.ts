export interface LevelData {
  list_index: number;
  title: string;
  description: string;
}

export interface Level extends LevelData {
  id: number;
}

export const CACHE_KEY_LEVELS = ["levels"];
