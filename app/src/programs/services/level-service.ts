import create from "../../services/http-service";

export interface Level {
  id: number;
  list_index: number;
  title: string;
  description: string;
}

export default (id: number) => create<Level>("/programs/" + id + "/levels");
