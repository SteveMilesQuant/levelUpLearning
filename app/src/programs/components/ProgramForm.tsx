import { HStack } from "@chakra-ui/react";
import useProgramForm from "../hooks/useProgramForm";
import ProgramFormBody from "./ProgramFormBody";
import programService, { Program } from "../services/program-service";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import DeleteButton from "../../components/DeleteButton";
import { AiFillEdit } from "react-icons/ai";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import { useState } from "react";

interface Props {
  program?: Program;
  setProgram?: (program?: Program) => void;
}

const ProgramForm = ({ program, setProgram }: Props) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const programForm = useProgramForm({ program, setProgram });

  const handleDeleteProgram = () => {
    if (!program) return;
    programService
      .delete(program.id)
      .then(() => {
        navigate("/programs");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <ProgramFormBody {...programForm} isReadOnly={!isEditing} />
      {setProgram && (
        <HStack justifyContent="right" spacing={3} paddingTop={3}>
          <ActionButton
            Component={AiFillEdit}
            label="Edit"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
          />
          <DeleteButton onConfirm={handleDeleteProgram} disabled={isEditing}>
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
              if (programForm.isValid) {
                programForm.handleClose();
                setIsEditing(false);
              }
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