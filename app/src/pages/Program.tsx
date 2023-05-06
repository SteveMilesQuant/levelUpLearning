import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  HStack,
  List,
  ListItem,
  useDisclosure,
} from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {
  Level,
  useLevels,
  ProgramForm,
  LevelForm,
  LevelFormModal,
  useProgram,
} from "../programs";
import ListButton from "../camps/components/ListButton";

const Program = () => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;

  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(
    undefined
  );

  const {
    data: program,
    error: programError,
    isLoading: loadingProgram,
  } = useProgram(id);
  const {
    data: levels,
    error: levelsError,
    isLoading: loadingLevels,
  } = useLevels(id);

  const {
    isOpen: newLevelIsOpen,
    onOpen: newLevelOnOpen,
    onClose: newLevelOnClose,
  } = useDisclosure();

  if (loadingProgram || loadingLevels || !program || !levels) return null;
  if (programError) throw programError;
  if (levelsError) throw levelsError;

  return (
    <>
      <PageHeader label={program?.title}></PageHeader>
      <HStack alignItems="start" spacing={10}>
        <List spacing={3}>
          <ListButton
            isSelected={!selectedLevel}
            onClick={() => setSelectedLevel(undefined)}
          >
            Program
          </ListButton>
          {levels
            ?.sort((a, b) => a.list_index - b.list_index)
            .map((level) => (
              <ListButton
                key={level.id}
                isSelected={selectedLevel?.id === level.id}
                onClick={() => setSelectedLevel(level)}
              >
                {level.list_index + ": " + level.title}
              </ListButton>
            ))}
          <ListItem>
            <Button onClick={newLevelOnOpen}>Add level</Button>
          </ListItem>
        </List>
        <Box width="100%">
          {!selectedLevel && (
            <ProgramForm program={program} isReadOnly={false} />
          )}
          {levels
            ?.filter((level) => level.id === selectedLevel?.id)
            .map((level) => (
              <LevelForm
                key={level.id}
                programId={program.id}
                level={level}
                isReadOnly={false}
              ></LevelForm>
            ))}
        </Box>
      </HStack>
      <LevelFormModal
        title="Add level"
        isOpen={newLevelIsOpen}
        onClose={newLevelOnClose}
        programId={program.id}
      ></LevelFormModal>
    </>
  );
};

export default Program;
