import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Camp } from "../Camp";
import { useAddCamp, useUpdateCamp } from "./useCamps";

export const campSchema = z.object({
  program_id: z
    .string()
    .min(1, { message: "Program is required." })
    .transform((val) => parseInt(val))
    .catch((ctx) => {
      if (typeof ctx.input === "number") return parseInt(ctx.input);
      throw ctx.error;
    }),
  primary_instructor_id: z
    .string()
    .min(1, { message: "Primary instructor is required." })
    .transform((val) => parseInt(val))
    .catch((ctx) => {
      if (typeof ctx.input === "number") return parseInt(ctx.input);
      throw ctx.error;
    }),
});

export type FormData = z.infer<typeof campSchema>;

const useCampForm = (camp?: Camp) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid: formIsValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(campSchema),
    defaultValues: useMemo(() => {
      return { ...camp };
    }, [camp]),
  });
  const isValid = formIsValid;

  const addCamp = useAddCamp();
  const updateCamp = useUpdateCamp();

  useEffect(() => {
    reset({ ...camp });
  }, [camp]);

  const handleClose = () => {
    reset({ ...camp });
  };

  const handleSubmitLocal = (data: FieldValues) => {
    if (!isValid) return;

    const newCamp = {
      id: 0,
      ...camp,
      ...data,
    } as Camp;

    if (camp) {
      // Update camp
      updateCamp.mutate(newCamp);
    } else {
      // Add new camp
      addCamp.mutate(newCamp);
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

export default useCampForm;
