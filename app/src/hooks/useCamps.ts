import { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import campService, { Camp } from "../services/camp-service";
import { Student, studentCampService } from "../services/student-service";
import programService from "../services/program-service";
import { AxiosResponse } from "axios";
import { instructorService } from "../services/user-service";

const useCamps = (student?: Student) => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { request, cancel } = student
      ? studentCampService(student).getAll()
      : campService.getAll();

    setIsLoading(true);
    request
      .then((response) => {
        let subPromises = new Array<Promise<AxiosResponse>>();
        response.data.forEach((camp) => {
          let programPromise = programService.get(camp.program_id);
          subPromises.push(programPromise);
          programPromise
            .then((pRes) => {
              camp.program = pRes.data;
            })
            .catch((error) => {
              if (error instanceof CanceledError) return;
              setError(error.message);
              setIsLoading(false);
            });

          let instructorPromise = instructorService.get(
            camp.primary_instructor_id
          );
          subPromises.push(instructorPromise);
          instructorPromise
            .then((pRes) => {
              camp.primary_instructor = pRes.data;
            })
            .catch((error) => {
              if (error instanceof CanceledError) return;
              setError(error.message);
              setIsLoading(false);
            });
        });
        Promise.all<AxiosResponse>(subPromises).then(() => {
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