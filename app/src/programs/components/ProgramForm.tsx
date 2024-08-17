import useProgramForm from "../hooks/useProgramForm";
import ProgramFormBody from "./ProgramFormBody";
import { Program } from "../Program";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDeleteProgram } from "../hooks/usePrograms";
import CrudButtonSet from "../../components/CrudButtonSet";

interface Props {
  program?: Program;
  isReadOnly?: boolean;
}

const ProgramForm = ({ program, isReadOnly }: Props) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const programForm = useProgramForm(program);
  const deleteProgram = useDeleteProgram({
    onDelete: () => {
      navigate("/programs");
    },
  });

  const handleDelete = () => {
    if (program) deleteProgram.mutate(program.id);
  };

  return (
    <>
      <ProgramFormBody {...programForm} isReadOnly={!isEditing} />
      {!isReadOnly && (
        <CrudButtonSet
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onDelete={handleDelete}
          confirmationLabel={program?.title}
          onCancel={programForm.handleClose}
          onSubmit={programForm.handleSubmit}
          isSubmitValid={programForm.isValid}
        />
      )}
    </>
  );
};

export default ProgramForm;
