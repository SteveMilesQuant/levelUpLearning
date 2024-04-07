import { Resource } from "./Resource";

export const CACHE_KEY_RESOURCE_GROUPS = ["resource_groups"];

export interface ResourceGroupData {
  title: string;
}

export interface ResourceGroup extends ResourceGroupData {
  id: number;
  resources: Resource[];
}
