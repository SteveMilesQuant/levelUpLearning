import { useEffect, useState } from "react";
import { CanceledError } from "../../services/api-client";
import campService, { Camp } from "../services/camp-service";

const useCamp = (id?: number) => {
  const [camp, setCamp] = useState<Camp | undefined>(undefined);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  if (!id) return { camp, error, isLoading, setCamp, setError };

  useEffect(() => {
    const request = campService.get(id);

    setIsLoading(true);
    request
      .then((response) => {
        setCamp(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  return { camp, error, isLoading, setCamp, setError };
};

export default useCamp;
