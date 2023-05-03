import axios, { AxiosResponse } from "axios";

// Handle date conversions
const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?$/;

function isIsoDateString(value: any): boolean {
  return value && typeof value === "string" && isoDateFormat.test(value);
}

function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== "object")
    return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = new Date(value);
    else if (typeof value === "object") handleDates(value);
  }
}

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.response.use((originalResponse) => {
  handleDates(originalResponse.data);
  return originalResponse;
});

// Create client (S: response body; Q: request body)
class APIClient<S, Q = S> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = () => {
    return axiosInstance.get<S[]>(this.endpoint).then((res) => res.data);
  };

  get = (id: number) => {
    return axiosInstance
      .get<S>(this.endpoint + "/" + id)
      .then((res) => res.data);
  };

  post = (data: Q) => {
    return axiosInstance
      .post<Q, AxiosResponse<S>>(this.endpoint, data)
      .then((res) => res.data);
  };

  put = (id: number, data: Q) => {
    return axiosInstance
      .put<Q, AxiosResponse<S>>(this.endpoint + "/" + id, data)
      .then((res) => res.data);
  };

  delete = (id: number) => {
    return axiosInstance.delete(this.endpoint + "/" + id);
  };
}

export default APIClient;
