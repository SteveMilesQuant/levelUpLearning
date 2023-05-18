import { Box, Button, HStack, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Level } from "../Level";
import useLevels from "../hooks/useLevels";
import LevelForm from "./LevelForm";
import LevelFormModal from "./LevelFormModal";
import LevelList from "./LevelList";

interface Props {
  programId: number;
}

const LevelsPage = ({ programId }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(
    undefined
  );
  const { data: levels, error, isLoading } = useLevels(programId);

  useEffect(() => {
    if (levels) setSelectedLevel(levels[0]);
  }, [!!levels]);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <>
      <HStack alignItems="start" spacing={10}>
        <LevelList
          programId={programId}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
        >
          <Button onClick={onOpen}>Add level</Button>
        </LevelList>
        <Box width="100%">
          {levels
            ?.filter((level) => level.id === selectedLevel?.id)
            .map((level) => (
              <LevelForm
                key={level.id}
                programId={programId}
                level={level}
                isReadOnly={false}
              ></LevelForm>
            ))}
        </Box>
      </HStack>
      <LevelFormModal
        title="Add level"
        isOpen={isOpen}
        onClose={onClose}
        programId={programId}
      ></LevelFormModal>
    </>
  );
};

export default LevelsPage;
