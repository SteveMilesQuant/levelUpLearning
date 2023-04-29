import { useEffect, useState } from "react";
import { CanceledError } from "../../services/old-api-client";
import studentService, { Student } from "../services/student-service";

const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { request, cancel } = studentService.getAll();

    setIsLoading(true);
    request
      .then((response) => {
        setStudents(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setIsLoading(false);
      });

    return () => cancel();
  }, []);

  return { students, error, isLoading, setStudents, setError };
};

export default useStudents;
