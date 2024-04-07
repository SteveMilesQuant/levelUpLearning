import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { ResourceGroup } from "../ResourceGroup";
import {
  useAddResourceGroup,
  useUpdateResourceGroup,
} from "./useResourceGroups";

const resourceGroupSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
});

export type FormData = z.infer<typeof resourceGroupSchema>;

const useResourceGroupForm = (resourceGroup?: ResourceGroup) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(resourceGroupSchema),
    defaultValues: useMemo(() => {
      return { ...resourceGroup };
    }, [resourceGroup]),
  });

  useMemo(() => {
    // Reset required when we update "resourceGroup" for via camps query invalidation
    // Because we use resourceGroup form to display resourceGroup details on a camp page
    reset({ ...resourceGroup });
  }, [resourceGroup]);

  const handleSuccess = () => {};

  const addResourceGroup = useAddResourceGroup();
  const updateResourceGroup = useUpdateResourceGroup({
    onSuccess: handleSuccess,
  });

  const handleClose = () => {
    reset({ ...resourceGroup });
  };

  const handleSubmitLocal = (data: FieldValues) => {
    const newResourceGroup = {
      id: 0,
      ...resourceGroup,
      ...data,
    } as ResourceGroup;

    if (resourceGroup) {
      // Update student
      updateResourceGroup.mutate(newResourceGroup);
    } else {
      // Add new student
      addResourceGroup.mutate(newResourceGroup);
    }
  };
  const handleSubmit = handleFormSubmit(handleSubmitLocal);

  return {
    register,
    errors,
    isValid,
    handleClose,
    handleSubmit,
  };
};

export default useResourceGroupForm;
