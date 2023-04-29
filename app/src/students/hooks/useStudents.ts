import { useQuery } from "@tanstack/react-query";
import { CACHE_KEY_STUDENTS, Student } from "../Student";
import studentService from "../student-service";
import ms from "ms";

const useStudents = () =>
  useQuery<Student[], Error>({
    queryKey: CACHE_KEY_STUDENTS,
    queryFn: studentService.getAll,
    staleTime: ms("24h"),
  });

export default useStudents;
