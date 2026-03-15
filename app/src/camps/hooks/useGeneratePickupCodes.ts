import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api-client";
import { CACHE_KEY_CAMPS } from "../Camp";

const useGeneratePickupCodes = (campId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () =>
            axiosInstance.post(`/camps/${campId}/generate-codes`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CACHE_KEY_CAMPS });
        },
    });
};

export default useGeneratePickupCodes;
