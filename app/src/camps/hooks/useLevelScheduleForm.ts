import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { LevelSchedule } from "../LevelSchedule";
import {
  useAddLevelSchedule,
  useUpdateLevelSchedule,
} from "./useLevelSchedules";

const levelSchema = z.object({
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
});

export type FormData = z.infer<typeof levelSchema>;

interface Props {
  campId?: number;
  levelSchedule?: LevelSchedule;
}

// For now, just using form to display - will add edit soon
const useLevelScheduleForm = ({ campId, levelSchedule }: Props) => {
  let start_time = levelSchedule?.start_time?.toISOString();
  start_time = start_time?.substring(0, start_time.length - 8);
  let end_time = levelSchedule?.end_time?.toISOString();
  end_time = end_time?.substring(0, end_time.length - 8);

  const {
    register,
    reset,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(levelSchema),
    defaultValues: useMemo(() => {
      return {
        start_time,
        end_time,
      };
    }, [levelSchedule]),
  });

  const addLevelSchedule = useAddLevelSchedule(campId);
  const updateLevelSchedule = useUpdateLevelSchedule(campId);

  const handleClose = () => {
    reset({ start_time, end_time });
  };
  useEffect(() => {
    handleClose();
  }, [start_time, end_time]);

  const handleSubmitLocal = (data: FieldValues) => {
    if (!campId) return;

    const newLevel = {
      id: 0,
      ...levelSchedule,
      ...data,
    } as LevelSchedule;

    if (levelSchedule) {
      updateLevelSchedule.mutate(newLevel);
    } else {
      addLevelSchedule.mutate(newLevel);
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

export default useLevelScheduleForm;
