import APIClient from "../services/api-client";
import { StudentFormData, StudentFormResponse } from "./StudentFormTypes";

export default new APIClient<StudentFormResponse, StudentFormData>("/forms");
