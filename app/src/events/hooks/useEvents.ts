import APIHooks from "../../services/api-hooks";
import APIClient, { axiosInstance } from "../../services/api-client";
import ms from "ms";
import { Event, EventData } from "../Event";
import { AxiosResponse } from "axios";
import { Image } from "../../interfaces/Image";

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


export const postTitleImage = (event_id: number, file: File, onSuccess: () => void) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    axiosInstance
        .post<FormData, AxiosResponse<number>>('/events/' + event_id + '/title_image', formData)
        .then(() => onSuccess());
}

export const addCarouselImage = (event_id: number, image: Image, file: File, onSuccess: () => void) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    axiosInstance
        .post<FormData, AxiosResponse<number>>('/events/' + event_id + '/carousel_images', formData, { params: { list_index: image.list_index } })
        .then(() => onSuccess());
}

export const updateCarouselImageOrder = (event_id: number, image: Image, onSuccess: () => void) => {
    axiosInstance
        .put<FormData, AxiosResponse<Event>>('/events/' + event_id + '/carousel_images/' + image.id, undefined, { params: { list_index: image.list_index } })
        .then(() => onSuccess());
}

export const deleteImage = (event_id: number, image_id?: number, onSuccess?: () => void) => {
    if (!image_id) return;
    axiosInstance
        .delete('/events/' + event_id + '/images/' + image_id)
        .then(() => { if (onSuccess) onSuccess(); });
}

