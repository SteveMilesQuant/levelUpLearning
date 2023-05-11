import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zj } from "zod-joda";
import { LevelSchedule } from "../LevelSchedule";
import {
  useAddLevelSchedule,
  useUpdateLevelSchedule,
} from "./useLevelSchedules";
import { LocalDateTime } from "@js-joda/core";

const levelScheduleSchema = z.object({
  start_time: zj.localDateTime(),
  end_time: zj.localDateTime(),
});

export type FormData = z.infer<typeof levelScheduleSchema>;

const toLocalISOString = (dateTime: LocalDateTime) => {
  let month = dateTime.monthValue().toString();
  if (month.length < 2) month = "0" + month;
  let day = dateTime.dayOfMonth().toString();
  if (day.length < 2) day = "0" + day;
  let hour = dateTime.hour().toString();
  if (hour.length < 2) hour = "0" + hour;
  let minute = dateTime.minute().toString();
  if (minute.length < 2) minute = "0" + minute;
  let second = dateTime.second().toString();
  if (second.length < 2) second = "0" + second;
  return `${dateTime.year()}-${month}-${day}T${hour}:${minute}:${second}`;
};

// For now, just using form to display - will add edit soon
const useLevelScheduleForm = (
  campId?: number,
  levelSchedule?: LevelSchedule
) => {
  const start_time = levelSchedule?.start_time;
  const end_time = levelSchedule?.end_time;

  const {
    register,
    reset,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(levelScheduleSchema),
    defaultValues: useMemo(() => {
      return {
        start_time,
        end_time,
      };
    }, [start_time, end_time]),
  });

  const addLevelSchedule = useAddLevelSchedule(campId);
  const updateLevelSchedule = useUpdateLevelSchedule(campId);

  const handleClose = () => {
    reset({ start_time, end_time });
  };

  const handleSubmitLocal = (data: FieldValues) => {
    if (!campId) return;

    const newLevel = {
      id: 0,
      ...levelSchedule,
      start_time: toLocalISOString(data.start_time),
      end_time: toLocalISOString(data.end_time),
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
