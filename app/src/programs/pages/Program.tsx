import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { Box, Button, HStack, List, ListItem, Text } from "@chakra-ui/react";
import useProgramForm from "../hooks/useProgramForm";
import ProgramFormBody from "../components/ProgramFormBody";
import PageHeader from "../../components/PageHeader";
import useProgram from "../hooks/useProgram";
import BodyContainer from "../../components/BodyContainer";
import ActionButton from "../../components/ActionButton";
import DeleteButton from "../../components/DeleteButton";
import programService from "../services/program-service";
import SubmitButton from "../../components/SubmitButton";
import CancelButton from "../../components/CancelButton";
import useLevels from "../hooks/useLevels";
import { Level } from "../services/level-service";

const Program = () => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(
    undefined
  );

  const { program, error, isLoading, setProgram, setError } = useProgram(id);
  const programForm = useProgramForm({ program, setProgram });
  const { levels, setLevels } = useLevels(id);

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
    <BodyContainer>
      <PageHeader label={program?.title}></PageHeader>
      <HStack alignItems="start" spacing={10}>
        <List spacing={3}>
          <ListItem>
            <Button
              variant="ghost"
              fontSize="lg"
              bgColor={selectedLevel ? undefined : "gray.300"}
              onClick={() => setSelectedLevel(undefined)}
              justifyContent="left"
              width="100%"
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
                justifyContent="left"
                width="100%"
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
          {!selectedLevel && (
            <>
              <ProgramFormBody
                {...programForm}
                program={program}
                isReadOnly={!isEditing}
              />
              <HStack justifyContent="right" spacing={3} paddingTop={3}>
                <ActionButton
                  Component={AiFillEdit}
                  label="Edit"
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                />
                <DeleteButton
                  onConfirm={handleDeleteProgram}
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
            </>
          )}
        </Box>
      </HStack>
    </BodyContainer>
  );
};

export default Program;
