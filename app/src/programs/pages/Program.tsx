import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  List,
  ListItem,
  useDisclosure,
} from "@chakra-ui/react";
import PageHeader from "../../components/PageHeader";
import useProgram from "../hooks/useProgram";
import BodyContainer from "../../components/BodyContainer";
import useLevels from "../hooks/useLevels";
import { Level } from "../services/level-service";
import ProgramForm from "../components/ProgramForm";
import { useParams } from "react-router-dom";
import LevelListButton from "../components/LevelListButton";
import LevelForm from "../components/LevelForm";
import LevelFormModal from "../components/LevelFormModal";

const Program = () => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;

  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(
    undefined
  );

  const { program, error, isLoading, setProgram, setError } = useProgram(id);
  const { levels, setLevels } = useLevels(id);

  const {
    isOpen: newLevelIsOpen,
    onOpen: newLevelOnOpen,
    onClose: newLevelOnClose,
  } = useDisclosure();

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
          {!selectedLevel && (
            <ProgramForm program={program} setProgram={setProgram} />
          )}
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
