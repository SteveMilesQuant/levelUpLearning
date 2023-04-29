import { useMutation, useQueryClient } from "@tanstack/react-query";
import studentService from "../student-service";
import { CACHE_KEY_STUDENTS, Student } from "../Student";

interface UpdateStudentContext {
  prevStudents: Student[];
}

const useUpdateStudent = (onUpdate?: () => void) => {
  const queryClient = useQueryClient();
  const udpateStudent = useMutation<
    Student,
    Error,
    Student,
    UpdateStudentContext
  >({
    mutationFn: (student: Student) => studentService.put(student.id, student),
    onMutate: (newStudent: Student) => {
      const prevStudents =
        queryClient.getQueryData<Student[]>(CACHE_KEY_STUDENTS) || [];
      queryClient.setQueryData<Student[]>(CACHE_KEY_STUDENTS, (students = []) =>
        students.map((s) => (s.id === newStudent.id ? newStudent : s))
      );
      if (onUpdate) onUpdate();
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

  return udpateStudent;
};

export default useUpdateStudent;
