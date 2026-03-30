import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api-client";

interface PickupRequest {
    student_ids: number[];
    code?: string;
    pickup_person_id?: number;
}

interface PickupResponse {
    pickup_person_name: string;
}

const usePickup = (campId: number) =>
    useMutation<PickupResponse, Error, PickupRequest>({
        mutationFn: (data: PickupRequest) =>
            axiosInstance
                .post<PickupResponse>(`/camps/${campId}/pickup`, data)
                .then((res) => res.data),
    });

export default usePickup;
