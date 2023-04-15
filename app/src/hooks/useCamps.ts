import { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import campService, { Camp } from "../services/camp-service";
import programService, { Program } from "../services/program-service";
import { AxiosResponse } from "axios";

const useCamps = () => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { request, cancel } = campService.getAll();

    setIsLoading(true);
    request
      .then((response) => {
        let programPromises = new Array<Promise<AxiosResponse>>();
        response.data.forEach((camp) => {
          let programPromise = programService.get(camp.program_id);
          programPromises.push(programPromise);
          programPromise
            .then((pRes) => {
              camp.program = pRes.data;
            })
            .catch((error) => {
              if (error instanceof CanceledError) return;
              setError(error.message);
              setIsLoading(false);
            });
        });
        Promise.all<AxiosResponse>(programPromises).then(() => {
          setCamps(response.data);
          setIsLoading(false);
        });
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      });

    return () => cancel();
  }, []);

  return { camps, error, isLoading, setCamps, setError };
};

export default useCamps;
