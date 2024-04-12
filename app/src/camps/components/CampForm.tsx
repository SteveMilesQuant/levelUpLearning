import { useNavigate } from "react-router-dom";
import { Camp } from "../Camp";
import CampFormBody from "./CampFormBody";
import CrudButtonSet from "../../components/CrudButtonSet";
import { useDeleteCamp } from "../hooks/useCamps";
import useCampForm from "../hooks/useCampForm";
import { useState } from "react";

interface Props {
  camp?: Camp;
}

const CampForm = ({ camp }: Props) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const campForm = useCampForm(camp);
  const deleteCamp = useDeleteCamp({
    onDelete: () => {
      navigate("/camps");
    },
  });

  const handleDelete = () => {
    if (camp) deleteCamp.mutate(camp.id);
  };

  return (
    <>
      <CampFormBody
        {...campForm}
        camp={camp}
        isReadOnly={!isEditing}
        showPrimaryInstructor={false}
      />
      <CrudButtonSet
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onDelete={handleDelete}
        confirmationLabel={camp?.program.title}
        onCancel={campForm.handleClose}
        onSubmit={campForm.handleSubmit}
        isSubmitValid={campForm.isValid}
      />
    </>
  );
};

export default CampForm;
