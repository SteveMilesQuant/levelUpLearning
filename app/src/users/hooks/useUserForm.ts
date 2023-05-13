import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "../User";
import { useMemo } from "react";
import { useUpdateUser } from "./useUser";

const userSchema = z.object({
  full_name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." }),
  email_address: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  instructor_subjects: z.string(),
  instructor_description: z.string(),
});

export type FormData = z.infer<typeof userSchema>;

const useUserForm = (user?: User) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid: formIsValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: useMemo(() => {
      return { ...user };
    }, [user]),
  });
  const isValid = formIsValid;

  const updateUser = useUpdateUser();

  const handleClose = () => {
    reset({ ...user });
  };

  const handleSubmitLocal = (data: FieldValues) => {
    if (!isValid) return;

    const newUser = {
      id: 0,
      ...user,
      ...data,
    } as User;

    if (user) {
      // Update student
      updateUser.mutate(newUser);
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
  };
};

export default useUserForm;
