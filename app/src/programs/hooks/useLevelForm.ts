import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Level } from "../Level";
import { useAddLevel, useUpdateLevel } from "./useLevels";

const levelSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string(),
});

export type FormData = z.infer<typeof levelSchema>;

const useLevelForm = (programId?: number, level?: Level) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid: isValidForm },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(levelSchema),
    defaultValues: useMemo(() => {
      return { ...level };
    }, [level]),
  });
  const isValid = isValidForm;

  const addLevel = useAddLevel(programId);
  const updateLevel = useUpdateLevel(programId);

  useEffect(() => {
    reset({ ...level });
  }, [level]);

  const handleClose = () => {
    reset({ ...level });
  };

  const handleSubmitLocal = (data: FieldValues) => {
    if (!programId) return;

    const newLevel = {
      id: 0,
      ...level,
      ...data,
    } as Level;

    if (level) {
      updateLevel.mutate(newLevel);
    } else {
      addLevel.mutate(newLevel);
    }
  };
  const handleSubmit = handleFormSubmit(handleSubmitLocal);

  return {
    register,
    errors,
    isValid,
    handleClose,
    handleSubmit,
  };
};

export default useLevelForm;
