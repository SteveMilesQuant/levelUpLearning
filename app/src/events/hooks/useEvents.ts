import APIHooks from "../../services/api-hooks";
import APIClient, { axiosInstance } from "../../services/api-client";
import ms from "ms";
import { Event, EventData } from "../Event";
import { AxiosResponse } from "axios";
import { QueryClient } from "@tanstack/react-query";

export const CACHE_KEY_EVENTS = ["events"];

const eventsClient = new APIClient<Event, EventData>("/events");
const eventsHooks = new APIHooks<Event, EventData>(
    eventsClient,
    CACHE_KEY_EVENTS,
    ms("5m")
);

export default eventsHooks.useDataList;
export const useEvent = eventsHooks.useData;
export const useAddEvent = eventsHooks.useAdd;
export const useUpdateEvent = eventsHooks.useUpdate;
export const useDeleteEvent = eventsHooks.useDelete;


export const postTitleImage = (queryClient: QueryClient, event_id: number, formData: FormData) => {
    const onSuccess = () => {
        queryClient.invalidateQueries({
            queryKey: CACHE_KEY_EVENTS,
            exact: false,
        });
    }
    axiosInstance
        .post<FormData, AxiosResponse<number>>('/events/' + event_id + '/title_image', formData)
        .then(() => onSuccess());
}

