import { HStack } from "@chakra-ui/react";
import useProgramForm from "../hooks/useProgramForm";
import ProgramFormBody from "./ProgramFormBody";
import { Program } from "../Program";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import DeleteButton from "../../components/DeleteButton";
import { AiFillEdit } from "react-icons/ai";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import { useState } from "react";
import { useDeleteProgram } from "../hooks/usePrograms";

interface Props {
  program?: Program;
  isReadOnly?: boolean;
}

const ProgramForm = ({ program, isReadOnly }: Props) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const programForm = useProgramForm(program);
  const deleteProgram = useDeleteProgram(() => {
    navigate("/programs");
  });

  return (
    <>
      <ProgramFormBody {...programForm} isReadOnly={!isEditing} />
      {!isReadOnly && (
        <HStack justifyContent="right" spacing={3} paddingTop={3}>
          <ActionButton
            Component={AiFillEdit}
            label="Edit"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
          />
          <DeleteButton
            onConfirm={() => deleteProgram.mutate(program?.id)}
            disabled={isEditing}
          >
            {program?.title}
          </DeleteButton>
          <CancelButton
            onClick={() => {
              programForm.handleClose();
              setIsEditing(false);
            }}
            disabled={!isEditing}
          >
            Cancel
          </CancelButton>
          <SubmitButton
            onClick={() => {
              programForm.handleSubmit();
              if (programForm.isValid) setIsEditing(false);
            }}
            disabled={!isEditing}
          >
            Update
          </SubmitButton>
        </HStack>
      )}
    </>
  );
};

export default ProgramForm;
