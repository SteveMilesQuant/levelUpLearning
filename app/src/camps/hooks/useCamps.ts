import { useEffect, useState } from "react";
import { CanceledError } from "../../services/api-client";
import campService, {
  Camp,
  scheduleCampService,
} from "../services/camp-service";
import {
  Student,
  studentCampService,
} from "../../students/services/student-service";
import programService from "../../programs/services/program-service";
import { AxiosResponse } from "axios";
import { instructorService } from "../../services/user-service";

interface Props {
  forScheduling?: boolean;
  student?: Student;
}

const useCamps = ({ student, forScheduling }: Props) => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { request, cancel } = forScheduling
      ? scheduleCampService.getAll()
      : student
      ? studentCampService(student).getAll()
      : campService.getAll();

    setIsLoading(true);
    request
      .then((response) => {
        setCamps(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      });

    return () => cancel();
  }, [student]);

  return { camps, error, isLoading, setCamps, setError };
};

export default useCamps;
