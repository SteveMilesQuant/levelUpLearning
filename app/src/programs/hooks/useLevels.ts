import { useEffect, useState } from "react";
import { CanceledError } from "../../services/api-client";
import levelService, { Level } from "../services/level-service";

const useLevels = (id?: number) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  if (!id) return { levels, error, isLoading, setLevels, setError };

  useEffect(() => {
    const { request, cancel } = levelService(id).getAll();

    setIsLoading(true);
    request
      .then((response) => {
        response.data.sort((a, b) => a.list_index - b.list_index);
        setLevels(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      });

    return () => cancel();
  }, []);

  return { levels, error, isLoading, setLevels, setError };
};

export default useLevels;
