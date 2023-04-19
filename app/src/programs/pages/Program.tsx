import { useState } from "react";
import { useParams } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { Box, Button, HStack } from "@chakra-ui/react";
import useProgramForm from "../hooks/useProgramForm";
import ProgramFormBody from "../components/ProgramFormBody";
import PageHeader from "../../components/PageHeader";
import useProgram from "../hooks/useProgram";
import BodyContainer from "../../components/BodyContainer";
import ActionButton from "../../components/ActionButton";
import DeleteButton from "../../components/DeleteButton";
import { Program as ProgramType } from "../services/program-service";
import SubmitButton from "../../components/SubmitButton";
import CancelButton from "../../components/CancelButton";

const Program = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const { program, error, isLoading, setProgram, setError } = useProgram(
    id ? parseInt(id) : undefined
  );

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleEdit = (program: ProgramType) => {
    setProgram(program);
  };

  const programForm = useProgramForm(program, handleCancelEdit, handleEdit);

  const handleDelete = () => {
    console.log("delete");
  };

  const title = program?.title || "";

  return (
    <BodyContainer>
      <PageHeader label={title}>
        <Box>
          <ActionButton
            Component={AiFillEdit}
            label="Edit"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
          />
          <DeleteButton onConfirm={handleDelete} disabled={isEditing}>
            {title}
          </DeleteButton>
        </Box>
      </PageHeader>
      <HStack>
        <Box>Levels here</Box>
        <Box width="100%">
          <ProgramFormBody
            {...programForm}
            program={program || undefined}
            isReadOnly={!isEditing}
          />
          <HStack justifyContent="right" spacing={3} paddingTop={3}>
            <CancelButton
              onClick={programForm.handleClose}
              disabled={!isEditing}
            >
              Cancel
            </CancelButton>
            <SubmitButton
              onClick={programForm.handleSubmit}
              disabled={!isEditing}
            >
              Update
            </SubmitButton>
          </HStack>
        </Box>
      </HStack>
    </BodyContainer>
  );
};

export default Program;
