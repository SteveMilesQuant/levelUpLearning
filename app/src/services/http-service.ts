import apiClient from "./api-client";

class HttpService<TData, T> {
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

  create(entity: TData) {
    return apiClient.post(this.endpoint, entity);
  }

  update(id: number, entity: TData) {
    return apiClient.put(this.endpoint + "/" + id, entity);
  }
}

const create = <TData, T>(endpoint: string) =>
  new HttpService<TData, T>(endpoint);

export default create;
