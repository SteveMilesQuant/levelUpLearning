import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { axiosInstance } from "../../services/api-client";
import {
    CACHE_KEY_PICKUP_PERSONS,
    UserPickupFormData,
    UserPickupFormResponse,
} from "../PickupPersonsTypes";
import ms from "ms";
import useAuth from "../../users/hooks/useAuth";

const STALE_TIME = ms("5m");

const usePickupPersons = () => {
    const { signedIn } = useAuth();
    return useQuery<UserPickupFormResponse, Error>({
        queryKey: CACHE_KEY_PICKUP_PERSONS,
        queryFn: () =>
            axiosInstance
                .get<UserPickupFormResponse>("/pickup-persons")
                .then((res) => res.data),
        staleTime: STALE_TIME,
        enabled: signedIn,
    });
};

export const useUpdatePickupPersons = () => {
    const queryClient = useQueryClient();
    return useMutation<UserPickupFormResponse, Error, UserPickupFormData>({
        mutationFn: (data) =>
            axiosInstance
                .put<UserPickupFormData, AxiosResponse<UserPickupFormResponse>>(
                    "/pickup-persons",
                    data
                )
                .then((res) => res.data),
        onSuccess: (newData) => {
            queryClient.setQueryData<UserPickupFormResponse>(
                CACHE_KEY_PICKUP_PERSONS,
                newData
            );
        },
    });
};

export default usePickupPersons;
