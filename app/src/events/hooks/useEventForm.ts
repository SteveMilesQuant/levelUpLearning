import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Event } from "../Event";
import { useAddEvent, useUpdateEvent } from "./useEvents";

export const eventSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    intro: z.string().optional(),
    link_url: z.string().optional(),
    link_text: z.string().optional()
});

export type FormData = z.infer<typeof eventSchema>;

const useEventForm = (event?: Event, onSuccess?: (event: Event) => void) => {

    const {
        register,
        getValues,
        handleSubmit: handleFormSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: useMemo(() => {
            return {
                ...event
            };
        }, [event]),
    });

    const addEvent = useAddEvent({ onSuccess });
    const updateEvent = useUpdateEvent({ onSuccess });

    const handleClose = () => {
        reset({ ...event });
    };

    const handleSubmitLocal = (data: FieldValues) => {
        if (!isValid) return;

        const newEvent = {
            ...event,
            ...data,
        } as Event;

        if (event && event.id) {
            // Update character
            updateEvent.mutate(newEvent);
        } else {
            // Add new character
            addEvent.mutate(newEvent);
        }
    };

    const handleSubmit = () => {
        handleFormSubmit(handleSubmitLocal)();
    };

    return {
        register,
        getValues,
        errors,
        handleClose,
        handleSubmit,
        isValid,
    };
};

export default useEventForm;
