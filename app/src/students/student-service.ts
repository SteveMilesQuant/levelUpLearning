import APIClient from "../services/api-client";
import { StudentData, Student } from "./Student";

export default new APIClient<StudentData, Student>("/students");
