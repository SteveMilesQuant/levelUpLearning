import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api-client";
import { StudentPickupPerson } from "../../forms/PickupPersonsTypes";
import { CACHE_KEY_CAMPS } from "../../camps";
import { CACHE_KEY_STUDENTS } from "../Student";

const useStudentPickupPersons = (campId: number, studentId: number) =>
    useQuery<StudentPickupPerson[], Error>({
        queryKey: [...CACHE_KEY_CAMPS, campId.toString(), ...CACHE_KEY_STUDENTS, studentId.toString(), "pickup-persons"],
        queryFn: () =>
            axiosInstance
                .get<StudentPickupPerson[]>(`/camps/${campId}/students/${studentId}/pickup-persons`)
                .then((res) => res.data),
    });

export default useStudentPickupPersons;
