import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Event } from "../Event";

export const eventSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    intro: z.string().optional(),
    link: z.object({ url: z.string(), text: z.string() }).optional(),
});

export type FormData = z.infer<typeof eventSchema>;

const useEventForm = (event?: Event) => {

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

            };
        }, [event]),
    });


    const handleClose = () => {
        reset({ ...event });
    };

    const handleSubmitLocal = (data: FieldValues) => {
        if (!isValid) return;

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
