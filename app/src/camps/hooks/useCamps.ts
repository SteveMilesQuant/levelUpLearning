import { useEffect, useState } from "react";
import { CanceledError } from "../../services/old-api-client";
import campService, {
  studentCampService,
  scheduleCampService,
} from "../camp-service";
import { Camp } from "../Camp";
import { Student } from "../../students";

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
      ? studentCampService(student.id).getAll()
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
