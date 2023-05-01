import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Student } from "../Student";
import { useAddStudent, useUpdateStudent } from "./useStudents";

export const studentSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
});

type FormData = z.infer<typeof studentSchema>;

const useStudentForm = (student?: Student) => {
  const [haveSubmitted, setHaveSubmitted] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(student?.grade_level || 0);

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
  const isValid = formIsValid && selectedGrade !== 0;

  const addStudent = useAddStudent();
  const updateStudent = useUpdateStudent();

  useEffect(() => {
    reset({ ...student });
    setSelectedGrade(student?.grade_level || 0);
  }, [student]);

  const handleClose = () => {
    reset({ ...student });
    setSelectedGrade(student?.grade_level || 0);
    setHaveSubmitted(false);
  };

  const handleSubmitLocal = (data: FieldValues) => {
    if (!isValid) return;

    const newStudent = {
      id: 0,
      ...student,
      ...data,
      grade_level: selectedGrade,
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
    setHaveSubmitted(true);
    handleFormSubmit(handleSubmitLocal)();
  };

  return {
    register,
    errors,
    handleClose,
    handleSubmit,
    selectedGrade,
    setSelectedGrade,
    haveSubmitted,
    isValid,
  };
};

export default useStudentForm;
