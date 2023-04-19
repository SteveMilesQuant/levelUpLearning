import { useState } from "react";
import { useParams } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { Box, Button, HStack, List, ListItem, Text } from "@chakra-ui/react";
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
import useLevels from "../hooks/useLevels";
import { Level } from "../services/level-service";

const Program = () => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;
  console.log(id);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const { program, error, isLoading, setProgram, setError } = useProgram(id);
  const { levels, setLevels } = useLevels(id);

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

  return (
    <BodyContainer>
      <PageHeader label={program?.title}>
        <Box>
          <ActionButton
            Component={AiFillEdit}
            label="Edit"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
          />
          <DeleteButton onConfirm={handleDelete} disabled={isEditing}>
            {program?.title}
          </DeleteButton>
        </Box>
      </PageHeader>
      <HStack alignItems="start" spacing={10}>
        <List spacing={3}>
          <ListItem>
            <Button
              as={Text}
              variant="ghost"
              fontSize="lg"
              bgColor={selectedLevel ? undefined : "gray.300"}
              onClick={() => setSelectedLevel(null)}
            >
              Program
            </Button>
          </ListItem>
          {levels?.map((level) => (
            <ListItem>
              <Button
                variant="ghost"
                fontSize="lg"
                bgColor={
                  selectedLevel?.id === level.id ? "gray.300" : undefined
                }
                onClick={() => setSelectedLevel(level)}
              >
                {level.list_index}: {level.title}
              </Button>
            </ListItem>
          ))}
          <ListItem>
            <Button>Add level</Button>
          </ListItem>
        </List>
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
