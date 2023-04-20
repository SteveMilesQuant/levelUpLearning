import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import studentService, { Student } from "../services/student-service";

export const studentSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
});

type FormData = z.infer<typeof studentSchema>;

interface Props {
  student?: Student;
  setStudent?: (student: Student) => void;
  students?: Student[];
  setStudents?: (student: Student[]) => void;
}

const useStudentForm = ({
  student,
  setStudent,
  students,
  setStudents,
}: Props) => {
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
    const origStudent = { ...student } as Student;
    const origStudents = students ? [...students] : [];

    // Optimistic rendering
    if (setStudent) {
      setStudent(newStudent);
    }
    if (setStudents) {
      if (student) {
        // Just updating one student in the list
        setStudents(
          origStudents.map((s) => (s.id === newStudent.id ? newStudent : s))
        );
      } else {
        // Adding a new student
        setStudents([newStudent, ...origStudents]);
      }
    }

    if (student) {
      var promise = studentService.update(newStudent);
    } else {
      promise = studentService.create(newStudent);
    }
    promise
      .then((res) => {
        if (setStudents && !student) {
          // Adding a new student... this will update id
          setStudents([res.data, ...origStudents]);
        }
      })
      .catch((err) => {
        // If it doesn't work out, reset to original
        if (setStudent) setStudent(origStudent);
        if (setStudents) setStudents(origStudents);
        console.log(err.message);
      });
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
