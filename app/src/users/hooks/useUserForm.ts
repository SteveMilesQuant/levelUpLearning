import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "../User";
import { useMemo } from "react";
import { useUpdateUser } from "./useUser";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_CAMPS } from "../../camps";

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
  const queryClient = useQueryClient();
  const {
    register,
    getValues,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: useMemo(() => {
      return { ...user };
    }, [user]),
  });

  const updateUser = useUpdateUser({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEY_CAMPS,
        exact: false,
      });
    },
  });

  const handleClose = () => {
    reset({ ...user });
  };

  // Most form hooks don't need this because they only have one form for updating, but users have two
  useMemo(() => {
    if (user) reset({ ...user });
  }, [user]);

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
    getValues,
    errors,
    handleClose,
    handleSubmit,
    isValid,
  };
};

export default useUserForm;
