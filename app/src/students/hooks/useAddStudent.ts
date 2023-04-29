import { useMutation, useQueryClient } from "@tanstack/react-query";
import studentService from "../student-service";
import { CACHE_KEY_STUDENTS, Student } from "../Student";

interface AddStudentContext {
  prevStudents: Student[];
}

const useAddStudent = (onAdd?: () => void) => {
  const queryClient = useQueryClient();
  const addStudent = useMutation<Student, Error, Student, AddStudentContext>({
    mutationFn: (student: Student) => studentService.post(student),
    onMutate: (newStudent: Student) => {
      const prevStudents =
        queryClient.getQueryData<Student[]>(CACHE_KEY_STUDENTS) || [];
      queryClient.setQueryData<Student[]>(
        CACHE_KEY_STUDENTS,
        (students = []) => [newStudent, ...students]
      );
      if (onAdd) onAdd();
      return { prevStudents };
    },
    onSuccess: (savedStudent, newStudent) => {
      queryClient.setQueryData<Student[]>(CACHE_KEY_STUDENTS, (students) =>
        students?.map((student) =>
          student === newStudent ? savedStudent : student
        )
      );
    },
    onError: (error, newStudent, context) => {
      if (!context) return;
      queryClient.setQueryData<Student[]>(
        CACHE_KEY_STUDENTS,
        () => context.prevStudents
      );
    },
  });

  return addStudent;
};

export default useAddStudent;
