import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Resource } from "../Resource";
import { useAddResource, useUpdateResource } from "./useResources";

const resourceSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  url: z.string().min(3, { message: "URL must be at least 3 characters." }),
});

export type FormData = z.infer<typeof resourceSchema>;

const useResourceGroupForm = (resourceGroupId: number, resource?: Resource) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: useMemo(() => {
      return { ...resource };
    }, [resource]),
  });

  useMemo(() => {
    // Reset required when we update "resourceGroup" for via camps query invalidation
    // Because we use resourceGroup form to display resourceGroup details on a camp page
    reset({ ...resource });
  }, [resource]);

  const handleSuccess = () => {};

  const addResourceGroup = useAddResource(resourceGroupId);
  const updateResourceGroup = useUpdateResource(resourceGroupId, {
    onSuccess: handleSuccess,
  });

  const handleClose = () => {
    reset({ ...resource });
  };

  const handleSubmitLocal = (data: FieldValues) => {
    const newResourceGroup = {
      id: 0,
      ...resource,
      ...data,
      group_id: resourceGroupId,
    } as Resource;

    if (resource) {
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
