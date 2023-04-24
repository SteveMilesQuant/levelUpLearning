import { useEffect, useState } from "react";
import { CanceledError } from "../../services/api-client";
import levelScheduleService, {
  LevelSchedule,
} from "../services/level-schedule-service";
import { Camp } from "../services/camp-service";

const useLevelSchedules = (camp: Camp) => {
  const [levelSchedules, setLevelSchedules] = useState<LevelSchedule[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { request, cancel } = levelScheduleService(camp.id).getAll();

    setIsLoading(true);
    request
      .then((response) => {
        setLevelSchedules(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      });

    return () => cancel();
  }, [camp]);

  return { levelSchedules, error, isLoading, setLevelSchedules, setError };
};

export default useLevelSchedules;
