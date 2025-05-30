import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { CACHE_KEY_STUDENTS, Student } from "../Student";
import { useAddStudent, useUpdateStudent } from "./useStudents";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_CAMPS } from "../../camps";

const studentSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  grade_level: z
    .number({ invalid_type_error: "Grade is required." })
    .catch((ctx) => {
      // I'd prefer use transform (string to number), but that doesn't play well with defaultValues
      // You end up getting numbers you have to catch from the default values, which must be numbers
      // Zod should fix this, or allow valueAsNumber (which it ignores)
      if (typeof ctx.input === "string") {
        const num = parseInt(ctx.input);
        if (!isNaN(num)) return num;
      }
      return 6;
    }),
});

export type FormData = z.infer<typeof studentSchema>;

const useStudentForm = (student?: Student) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid: formIsValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: useMemo(() => {
      return { ...student };
    }, [student]),
  });
  const isValid = formIsValid;

  const queryClient = useQueryClient();
  const addStudent = useAddStudent();
  const updateStudent = useUpdateStudent({
    onSuccess: () => {
      // Invalidate each of this student's camps
      student?.camps.forEach((student) => {
        queryClient.invalidateQueries({
          queryKey: [
            ...CACHE_KEY_CAMPS,
            student.id.toString(),
            ...CACHE_KEY_STUDENTS,
          ],
        });
      });
    },
  });

  const handleClose = () => {
    reset({ ...student });
  };

  const handleSubmitLocal = (data: FieldValues) => {
    if (!isValid) return;

    const newStudent = {
      id: 0,
      camps: [],
      ...student,
      ...data,
    } as Student;

    if (student) {
      // Update student
      updateStudent.mutate(newStudent);
    } else {
      // Add new student
      addStudent.mutate(newStudent);
    }
  };

  const handleSubmit = () => {
    handleFormSubmit(handleSubmitLocal)();
  };

  return {
    register,
    errors,
    handleClose,
    handleSubmit,
    isValid,
  };
};

export default useStudentForm;
