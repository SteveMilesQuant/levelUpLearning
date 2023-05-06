import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Student } from "../Student";
import { useAddStudent, useUpdateStudent } from "./useStudents";

export const studentSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  grade_level: z
    .string()
    .min(1, { message: "Grade is required." })
    .transform((val) => parseInt(val))
    .catch((ctx) => {
      if (typeof ctx.input === "number") return parseInt(ctx.input);
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

  useEffect(() => {
    reset({ ...student });
  }, [student]);

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
