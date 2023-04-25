import { useEffect, useState } from "react";
import { CanceledError } from "../../services/api-client";
import programService, { Program } from "../services/program-service";

const usePrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { request, cancel } = programService.getAll();

    setIsLoading(true);
    request
      .then((response) => {
        setPrograms(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      });

    return () => cancel();
  }, []);

  return { programs, error, isLoading, setPrograms, setError };
};

export default usePrograms;
