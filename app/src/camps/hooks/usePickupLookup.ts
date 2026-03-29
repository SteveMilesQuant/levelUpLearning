import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api-client";

export interface PickupStudentInfo {
    id: number;
    name: string;
}

export interface PickupLookupResponse {
    pickup_person_name: string;
    students: PickupStudentInfo[];
}

const usePickupLookup = (campId: number) =>
    useMutation<PickupLookupResponse, Error, string>({
        mutationFn: (code: string) =>
            axiosInstance
                .get<PickupLookupResponse>(`/camps/${campId}/pickup`, {
                    params: { code },
                })
                .then((res) => res.data),
    });

export default usePickupLookup;
