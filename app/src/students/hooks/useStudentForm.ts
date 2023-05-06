import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Student } from "../Student";
import { useAddStudent, useUpdateStudent } from "./useStudents";

export const studentSchema = z.object({
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
      throw ctx.error;
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

  const addStudent = useAddStudent();
  const updateStudent = useUpdateStudent();

  const handleClose = () => {
    reset({ ...student });
  };

  const handleSubmitLocal = (data: FieldValues) => {
    if (!isValid) return;

    const newStudent = {
      id: 0,
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
