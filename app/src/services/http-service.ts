import apiClient from "./api-client";

interface Entity {
  id: number;
}

class HttpService<T extends Entity> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll() {
    const controller = new AbortController();
    const request = apiClient.get<T[]>(this.endpoint, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  delete(id: number) {
    return apiClient.delete(this.endpoint + "/" + id);
  }

  create(entity: T) {
    return apiClient.post(this.endpoint, entity);
  }

  update(entity: T) {
    return apiClient.patch(this.endpoint + "/" + entity.id, entity);
  }
}

const create = <T extends Entity>(endpoint: string) =>
  new HttpService<T>(endpoint);

export default create;
