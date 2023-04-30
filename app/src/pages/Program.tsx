import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  List,
  ListItem,
  useDisclosure,
} from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import BodyContainer from "../components/BodyContainer";
import useLevels from "../programs/hooks/useLevels";
import { Level } from "../programs/Level";
import ProgramForm from "../programs/components/ProgramForm";
import { useParams } from "react-router-dom";
import LevelListButton from "../programs/components/LevelListButton";
import LevelForm from "../programs/components/LevelForm";
import LevelFormModal from "../programs/components/LevelFormModal";
import { useProgram } from "../programs/hooks/usePrograms";

const Program = () => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;

  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(
    undefined
  );

  const { data: program, error, isLoading } = useProgram(id);

  const { levels, setLevels } = useLevels(id);

  const {
    isOpen: newLevelIsOpen,
    onOpen: newLevelOnOpen,
    onClose: newLevelOnClose,
  } = useDisclosure();

  if (isLoading || !program) return null;
  if (error) throw error;

  return (
    <BodyContainer>
      <PageHeader label={program?.title}></PageHeader>
      <HStack alignItems="start" spacing={10}>
        <List spacing={3}>
          <LevelListButton
            isSelected={!selectedLevel}
            onClick={() => setSelectedLevel(undefined)}
          >
            Program
          </LevelListButton>
          {levels?.map((level) => (
            <LevelListButton
              key={level.id}
              isSelected={selectedLevel?.id === level.id}
              onClick={() => setSelectedLevel(level)}
            >
              {level.list_index + ": " + level.title}
            </LevelListButton>
          ))}
          <ListItem>
            <Button onClick={newLevelOnOpen}>Add level</Button>
          </ListItem>
        </List>
        <Box width="100%">
          {!selectedLevel && <ProgramForm program={program} canUpdate={true} />}
          {levels
            ?.filter((level) => level.id === selectedLevel?.id)
            .map((level) => (
              <LevelForm
                key={level.id}
                program={program}
                level={level}
                levels={levels}
                setLevels={setLevels}
              ></LevelForm>
            ))}
        </Box>
      </HStack>
      <LevelFormModal
        title="Add level"
        isOpen={newLevelIsOpen}
        onClose={newLevelOnClose}
        program={program}
        levels={levels}
        setLevels={setLevels}
      ></LevelFormModal>
    </BodyContainer>
  );
};

export default Program;
