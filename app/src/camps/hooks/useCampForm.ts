import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Camp } from "../Camp";
import { useAddCamp, useUpdateCamp } from "./useCamps";
import { usePrograms } from "../../programs";
import useInstructors from "../../hooks/useInstructors";

export const campSchema = z.object({
  program_id: z
    .number({ invalid_type_error: "Program is required." })
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
  primary_instructor_id: z
    .number({ invalid_type_error: "Primary instructor is required." })
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

export type FormData = z.infer<typeof campSchema>;

const useCampForm = (camp?: Camp) => {
  const { data: programs } = usePrograms();
  const { data: instructors } = useInstructors();
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

    const program = programs?.find((p) => p.id === data.program_id);
    const instructor = instructors?.find(
      (i) => i.id === data.primary_instructor_id
    );

    const newCamp = {
      id: 0,
      ...camp,
      ...data,
      program: { ...program },
      primary_instructor: { ...instructor },
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
