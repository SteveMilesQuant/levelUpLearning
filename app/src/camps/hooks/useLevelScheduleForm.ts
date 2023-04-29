import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LevelSchedule } from "../LevelSchedule";

const levelSchema = z.object({
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
});

export type FormData = z.infer<typeof levelSchema>;

interface Props {
  levelSchedule?: LevelSchedule;
}

// For now, just using form to display - will add edit soon
const useLevelForm = ({ levelSchedule }: Props) => {
  let start_time = levelSchedule?.start_time?.toISOString();
  start_time = start_time?.substring(0, start_time.length - 8);
  let end_time = levelSchedule?.end_time?.toISOString();
  end_time = end_time?.substring(0, end_time.length - 8);

  const {
    register,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(levelSchema),
    defaultValues: useMemo(() => {
      return {
        start_time,
        end_time,
      };
    }, [levelSchedule]),
  });

  useEffect(() => {
    reset({
      start_time,
      end_time,
    });
  }, [levelSchedule]);

  return {
    register,
    errors,
  };
};

export default useLevelForm;
