import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import programService, { Program } from "../services/program-service";

const programSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  tags: z.string(),
  description: z.string(),
});

export type FormData = z.infer<typeof programSchema>;

const useProgramForm = (
  program: Program | null,
  onClose: () => void,
  onSubmit: (program: Program) => void
) => {
  const defaultGradeRange = program?.grade_range || [6, 8];
  const [selectedGradeRange, setSelectedGradeRange] =
    useState(defaultGradeRange);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(programSchema),
    defaultValues: useMemo(() => {
      return { ...program };
    }, [program]),
  });

  useEffect(() => {
    reset({ ...program });
  }, [program]);

  const handleClose = () => {
    reset({ ...program });
    setSelectedGradeRange(defaultGradeRange);
    onClose();
  };

  const handleSubmitLocal = (data: FieldValues) => {
    if (program) {
      var promise = programService.update({
        ...program,
        ...data,
        grade_range: selectedGradeRange,
      } as Program);
    } else {
      promise = programService.create({
        id: 0,
        ...data,
        grade_range: selectedGradeRange,
      } as Program);
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
    handleFormSubmit(handleSubmitLocal)(e);
  };

  return {
    register,
    errors,
    handleClose,
    handleSubmit,
    selectedGradeRange,
    setSelectedGradeRange,
  };
};

export default useProgramForm;
