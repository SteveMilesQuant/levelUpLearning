import { useMutation, useQueryClient } from "@tanstack/react-query";
import studentService from "../student-service";
import { CACHE_KEY_STUDENTS, Student } from "../Student";

interface DeleteStudentContext {
  prevStudents: Student[];
}

const useDeleteStudent = (onDelete?: () => void) => {
  const queryClient = useQueryClient();
  const deleteStudent = useMutation<any, Error, any, DeleteStudentContext>({
    mutationFn: (studentId: number) => studentService.delete(studentId),
    onMutate: (studentId: number) => {
      const prevStudents =
        queryClient.getQueryData<Student[]>(CACHE_KEY_STUDENTS) || [];
      queryClient.setQueryData<Student[]>(CACHE_KEY_STUDENTS, (students = []) =>
        students.filter((s) => s.id !== studentId)
      );
      if (onDelete) onDelete();
      return { prevStudents };
    },
    onError: (error, newStudent, context) => {
      if (!context) return;
      queryClient.setQueryData<Student[]>(
        CACHE_KEY_STUDENTS,
        () => context.prevStudents
      );
    },
  });

  return deleteStudent;
};

export default useDeleteStudent;
