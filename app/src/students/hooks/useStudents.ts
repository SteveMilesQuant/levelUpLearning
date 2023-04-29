import { CACHE_KEY_STUDENTS, Student, StudentData } from "../Student";
import UseAPI from "../../hooks/useApi";
import APIClient from "../../services/api-client";

const useStudents = new UseAPI<StudentData, Student>(
  new APIClient<StudentData, Student>("/students"),
  CACHE_KEY_STUDENTS
);

export default useStudents.useData;
export const useAddStudent = useStudents.useAdd;
export const useUpdateStudent = useStudents.useUpdate;
export const useDeleteStudent = useStudents.useDelete;
