export const CACHE_KEY_RESOURCES = ["resources"];

export interface ResourceData {
  title: string;
  url: string;
  list_index: number;
}

export interface Resource extends ResourceData {
  id: number;
  group_id: number;
}
