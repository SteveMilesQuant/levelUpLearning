import { useState } from "react";
import { Resource } from "../Resource";
import { useDeleteResource } from "../hooks/useResources";
import { FormControl, Input, Td, Tr } from "@chakra-ui/react";
import InputError from "../../components/InputError";
import CrudButtonSet from "../../components/CrudButtonSet";
import useResourceForm from "../hooks/useResourceForm";

export interface Props {
  resourceGroupId: number;
  resource?: Resource;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const ResourcesTableRow = ({
  resourceGroupId,
  resource,
  onCancel,
  onSuccess,
}: Props) => {
  const [isEditing, setIsEditing] = useState(!resource);
  const { register, errors, handleClose, handleSubmit, isValid } =
    useResourceForm(resourceGroupId, resource);
  const deleteResource = useDeleteResource(resourceGroupId);

  const handleDelete = () => {
    if (resource) deleteResource.mutate(resource.id);
  };

  const handleCancel = () => {
    handleClose();
    if (onCancel) onCancel();
  };

  const handleSuccess = () => {
    handleSubmit();
    if (onSuccess) onSuccess();
  };

  return (
    <Tr>
      <Td>
        <FormControl>
          <InputError
            label={errors.title?.message}
            isOpen={errors.title ? true : false}
          >
            <Input {...register("title")} type="text" isReadOnly={!isEditing} />
          </InputError>
        </FormControl>
      </Td>
      <Td>
        <FormControl>
          <InputError
            label={errors.url?.message}
            isOpen={errors.url ? true : false}
          >
            <Input {...register("url")} type="text" isReadOnly={!isEditing} />
          </InputError>
        </FormControl>
      </Td>
      <Td>
        <CrudButtonSet
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onDelete={handleDelete}
          confirmationLabel={resource?.title}
          onCancel={handleCancel}
          onSubmit={handleSuccess}
          isSubmitValid={isValid}
        />
      </Td>
    </Tr>
  );
};

export default ResourcesTableRow;
