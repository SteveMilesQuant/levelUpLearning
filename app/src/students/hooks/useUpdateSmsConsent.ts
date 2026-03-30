import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api-client";
import { CACHE_KEY_CAMPS } from "../../camps";

interface PatchData {
    pickupPersonId: number;
    sms_consent: boolean | null;
}

const useUpdateSmsConsent = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, PatchData>({
        mutationFn: (data: PatchData) =>
            axiosInstance
                .patch(`/pickup-persons/${data.pickupPersonId}`, {
                    sms_consent: data.sms_consent,
                })
                .then(() => undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CACHE_KEY_CAMPS });
        },
    });
};

export default useUpdateSmsConsent;
