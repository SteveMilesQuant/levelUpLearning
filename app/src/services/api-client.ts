import axios, { CanceledError } from "axios";

export default axios.create({
  baseURL: "https://localhost/api",
});

export { CanceledError };
