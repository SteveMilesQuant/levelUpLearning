import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Camp } from "../Camp";
import { useAddCamp, useUpdateCamp } from "./useCamps";
import { usePrograms } from "../../programs";
import { useUsers } from "../../users";

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
  z_daily_start_time: z.date().optional(),
  z_daily_end_time: z.date().optional(),
  z_dates: z.date().optional().array(),
  cost: z
    .number({ invalid_type_error: "Cost is required." })
    .nonnegative({ message: "Cost must be non-negative." })
    .catch((ctx) => {
      // I'd prefer use transform (string to number), but that doesn't play well with defaultValues
      // You end up getting numbers you have to catch from the default values, which must be numbers
      // Zod should fix this, or allow valueAsNumber (which it ignores)
      if (typeof ctx.input === "string") {
        const num = parseFloat(ctx.input);
        if (!isNaN(num) && num >= 0.0) return num;
      }
      throw ctx.error;
    }),
});

export type FormData = z.infer<typeof campSchema>;

const useCampForm = (camp?: Camp) => {
  const { data: programs } = usePrograms();
  const { data: instructors } = useUsers({ role: "INSTRUCTOR" });
  const {
    register,
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(campSchema),
    defaultValues: useMemo(() => {
      return {
        ...camp,
        z_daily_start_time:
          camp && camp.daily_start_time
            ? new Date("2023-01-01T" + camp.daily_start_time)
            : undefined,
        z_daily_end_time:
          camp && camp.daily_end_time
            ? new Date("2023-01-01T" + camp.daily_end_time)
            : undefined,
        z_dates: camp?.dates?.map(
          (date_str) => new Date(date_str + "T00:00:00")
        ),
      };
    }, [camp]),
  });

  const addCamp = useAddCamp();
  const updateCamp = useUpdateCamp();

  const handleClose = () => {
    reset({ ...camp });
  };

  const handleSubmitLocal = (data: FieldValues) => {
    if (!isValid) return;

    const program = programs?.find((p) => p.id === data.program_id);
    const instructor = instructors?.find(
      (i) => i.id === data.primary_instructor_id
    );

    const start = data.z_daily_start_time;
    const end = data.z_daily_end_time;
    const dates = data.z_dates.map(
      (date: Date) =>
        date.getFullYear() +
        (date.getMonth() < 9 ? "-0" : "-") +
        (date.getMonth() + 1) +
        (date.getDate() < 9 ? "-0" : "-") +
        date.getDate()
    );

    const newCamp = {
      id: 0,
      ...camp,
      ...data,
      daily_start_time: start
        ? start.getHours() +
          (start.getMinutes() < 10 ? ":0" : ":") +
          +start.getMinutes() +
          (start.getSeconds() < 10 ? ":0" : ":") +
          start.getSeconds()
        : undefined,
      daily_end_time: end
        ? end.getHours() +
          (start.getMinutes() < 10 ? ":0" : ":") +
          end.getMinutes() +
          (start.getSeconds() < 10 ? ":0" : ":") +
          end.getSeconds()
        : undefined,
      dates,
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
    control,
    errors,
    handleClose,
    handleSubmit,
    isValid,
  };
};

export default useCampForm;
