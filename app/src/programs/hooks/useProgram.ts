import { useEffect, useState } from "react";
import { CanceledError } from "../../services/api-client";
import programService, { Program } from "../services/program-service";

const usePrograms = (id?: number) => {
  const [program, setProgram] = useState<Program | undefined>(undefined);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  if (!id) return { program, error, isLoading, setProgram, setError };

  useEffect(() => {
    const request = programService.get(id);

    setIsLoading(true);
    request
      .then((response) => {
        setProgram(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  return { program, error, isLoading, setProgram, setError };
};

export default usePrograms;
