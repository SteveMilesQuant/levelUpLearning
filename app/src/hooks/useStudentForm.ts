import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import studentService, { Student } from "../services/student-service";

const schema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
});

type FormData = z.infer<typeof schema>;

const useStudentForm = (
  student: Student | null,
  onClose: () => void,
  onSubmit: (student: Student) => void
) => {
  const defaultGrade = student?.grade_level || 0;
  const [haveSubmitted, setHaveSubmitted] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(defaultGrade);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleClose = () => {
    reset();
    setSelectedGrade(defaultGrade);
    setHaveSubmitted(false);
    onClose();
  };

  const handleSubmitLocal = function (data: FieldValues) {
    if (selectedGrade === 0) return;
    if (student) {
      var promise = studentService.update({
        ...student,
        ...data,
        grade_level: selectedGrade,
      } as Student);
    } else {
      promise = studentService.create({
        id: 0,
        ...data,
        grade_level: selectedGrade,
      } as Student);
    }
    promise
      .then((res) => {
        onSubmit(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
    handleClose();
  };

  const handleSubmit = (e: FormEvent) => {
    setHaveSubmitted(true);
    handleFormSubmit(handleSubmitLocal)(e);
  };

  return {
    register,
    errors,
    handleClose,
    handleSubmit,
    haveSubmitted,
    setHaveSubmitted,
    selectedGrade,
    setSelectedGrade,
  };
};

export default useStudentForm;
