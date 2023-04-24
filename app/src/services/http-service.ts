import apiClient from "./api-client";

class HttpService<T> {
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

  get(id: number) {
    return apiClient.get<T>(this.endpoint + "/" + id);
  }

  delete(id: number) {
    return apiClient.delete(this.endpoint + "/" + id);
  }

  create(entity: T) {
    return apiClient.post(this.endpoint, entity);
  }

  update(id: number, entity: T) {
    return apiClient.put(this.endpoint + "/" + id, entity);
  }
}

const create = <T>(endpoint: string) => new HttpService<T>(endpoint);

export default create;
