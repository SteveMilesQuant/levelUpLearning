import axios, { CanceledError } from "axios";

export default axios.create({
  baseURL: process.env.VITE_API_URL,
});

export { CanceledError };
