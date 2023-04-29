import create from "../services/http-service";
import { StudentData, Student } from "./Student";

export default create<StudentData, Student>("/students");
