import { useEffect, useState } from "react";
import { CanceledError } from "../../services/old-api-client";
import levelScheduleService, {
  LevelSchedule,
} from "../services/level-schedule-service";

const useLevelSchedules = (campId?: number) => {
  const [levelSchedules, setLevelSchedules] = useState<LevelSchedule[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  if (!campId)
    return { levelSchedules, error, isLoading, setLevelSchedules, setError };

  useEffect(() => {
    const { request, cancel } = levelScheduleService(campId).getAll();

    setIsLoading(true);
    request
      .then((response) => {
        response.data.sort((a, b) => a.level.list_index - b.level.list_index);
        setLevelSchedules(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      });

    return () => cancel();
  }, [campId]);

  return { levelSchedules, error, isLoading, setLevelSchedules, setError };
};

export default useLevelSchedules;
