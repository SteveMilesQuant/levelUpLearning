import useResourceGroupForm from "../hooks/useResourceGroupForm";
import ResourceGroupFormBody from "./ResourceGroupFormBody";
import { ResourceGroup } from "../ResourceGroup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDeleteResourceGroup } from "../hooks/useResourceGroups";
import CrudButtonSet from "../../components/CrudButtonSet";

interface Props {
  resourceGroup: ResourceGroup;
}

const ResourceGroupForm = ({ resourceGroup }: Props) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const resourceGroupForm = useResourceGroupForm(resourceGroup);
  const deleteResourceGroup = useDeleteResourceGroup({
    onDelete: () => {
      navigate("/equip");
    },
  });

  const handleDelete = () => {
    if (resourceGroup) deleteResourceGroup.mutate(resourceGroup.id);
  };

  return (
    <>
      <ResourceGroupFormBody {...resourceGroupForm} isReadOnly={!isEditing} />
      <CrudButtonSet
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onDelete={handleDelete}
        confirmationLabel={resourceGroup?.title}
        onCancel={resourceGroupForm.handleClose}
        onSubmit={resourceGroupForm.handleSubmit}
        isSubmitValid={resourceGroupForm.isValid}
      />
    </>
  );
};

export default ResourceGroupForm;
