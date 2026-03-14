import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { StudentFormResponse } from "../StudentFormTypes";
import { useAddForm, useUpdateForm } from "./useForms";

const studentFormSchema = z.object({
    child_school: z.string().min(1, { message: "School is required." }),
    parent_name: z.string().min(1, { message: "Parent name is required." }),
    parent_email: z.string().optional().default(""),
    parent_phone: z.string().min(1, { message: "Phone number is required." }),
    emergency_contact: z
        .string()
        .min(1, { message: "Emergency contact is required." }),
    allergies: z
        .string()
        .min(1, { message: "Allergies/health info is required. Enter 'None' if not applicable." }),
    pickup_persons: z
        .string()
        .min(1, { message: "Pickup person(s) required." }),
    additional_info: z.string().optional().default(""),
    photo_permission: z.boolean({
        required_error: "Photo permission selection is required.",
        invalid_type_error: "Photo permission selection is required.",
    }),
    referral_source: z.string().optional().default(""),
});

export type FormData = z.infer<typeof studentFormSchema>;

interface Props {
    studentId: number;
    existingForm?: StudentFormResponse;
}

const useStudentFormEntry = ({ studentId, existingForm }: Props) => {
    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors, isValid: formIsValid },
        reset,
        control,
        setValue,
        watch,
        trigger,
    } = useForm<FormData>({
        resolver: zodResolver(studentFormSchema),
        defaultValues: useMemo(() => {
            if (existingForm) {
                return {
                    child_school: existingForm.child_school || "",
                    parent_name: existingForm.parent_name || "",
                    parent_email: existingForm.parent_email || "",
                    parent_phone: existingForm.parent_phone || "",
                    emergency_contact: existingForm.emergency_contact || "",
                    allergies: existingForm.allergies || "",
                    pickup_persons: existingForm.pickup_persons || "",
                    additional_info: existingForm.additional_info || "",
                    photo_permission: existingForm.photo_permission ?? undefined,
                    referral_source: existingForm.referral_source || "",
                };
            }
            return {};
        }, [existingForm]),
    });
    const isValid = formIsValid;

    const addForm = useAddForm();
    const updateForm = useUpdateForm();

    const handleClose = () => {
        if (existingForm) {
            reset({
                child_school: existingForm.child_school || "",
                parent_name: existingForm.parent_name || "",
                parent_email: existingForm.parent_email || "",
                parent_phone: existingForm.parent_phone || "",
                emergency_contact: existingForm.emergency_contact || "",
                allergies: existingForm.allergies || "",
                pickup_persons: existingForm.pickup_persons || "",
                additional_info: existingForm.additional_info || "",
                photo_permission: existingForm.photo_permission ?? undefined,
                referral_source: existingForm.referral_source || "",
            });
        } else {
            reset({});
        }
    };

    const handleSubmitLocal = (data: FieldValues) => {
        if (!isValid) return;

        if (existingForm) {
            updateForm.mutate({
                ...existingForm,
                ...data,
            } as StudentFormResponse);
        } else {
            addForm.mutate({
                student_id: studentId,
                ...data,
            } as any);
        }
    };

    const handleSubmit = () => {
        handleFormSubmit(handleSubmitLocal)();
    };

    return {
        register,
        errors,
        handleClose,
        handleSubmit,
        isValid,
        control,
        setValue,
        watch,
        triggerValidation: trigger,
    };
};

export default useStudentFormEntry;
