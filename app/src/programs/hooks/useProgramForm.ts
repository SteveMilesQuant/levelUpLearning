import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Program } from "../Program";
import { useAddProgram, useUpdateProgram } from "./usePrograms";

const programSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  tags: z.string(),
  description: z.string(),
});

export type FormData = z.infer<typeof programSchema>;

const useProgramForm = (program?: Program) => {
  const [selectedGradeRange, setSelectedGradeRange] = useState(
    program?.grade_range || [6, 8]
  );

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid: isValidForm },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(programSchema),
    defaultValues: useMemo(() => {
      return { ...program };
    }, [program]),
  });
  const isValid = isValidForm;

  const addProgram = useAddProgram();
  const updateProgram = useUpdateProgram(() => {
    reset({ ...program });
  });

  useEffect(() => {
    reset({ ...program });
    setSelectedGradeRange(program?.grade_range || [6, 8]);
  }, [program]);

  const handleClose = () => {
    reset({ ...program });
    setSelectedGradeRange(program?.grade_range || [6, 8]);
  };

  const handleSubmitLocal = (data: FieldValues) => {
    const newProgram = {
      id: 0,
      ...program,
      ...data,
      grade_range: selectedGradeRange,
    } as Program;

    if (program) {
      // Update student
      updateProgram.mutate(newProgram);
    } else {
      // Add new student
      addProgram.mutate(newProgram);
    }
  };
  const handleSubmit = handleFormSubmit(handleSubmitLocal);

  return {
    register,
    errors,
    isValid,
    handleClose,
    handleSubmit,
    selectedGradeRange,
    setSelectedGradeRange,
  };
};

export default useProgramForm;
