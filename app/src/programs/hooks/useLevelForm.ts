import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Level } from "../Level";
import { useAddLevel, useUpdateLevel } from "./useLevels";
import { CACHE_KEY_CAMPS } from "../../camps";
import { useQueryClient } from "@tanstack/react-query";

const levelSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string(),
});

export type FormData = z.infer<typeof levelSchema>;

const useLevelForm = (programId?: number, level?: Level) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(levelSchema),
    defaultValues: useMemo(() => {
      return { ...level };
    }, [level]),
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: CACHE_KEY_CAMPS,
      exact: false,
    });
  };

  const addLevel = useAddLevel(programId, { onSuccess: handleSuccess });
  const updateLevel = useUpdateLevel(programId, { onSuccess: handleSuccess });

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
