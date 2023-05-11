import { Box, Button, HStack, Stack, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Level } from "../Level";
import useLevels, { useDeleteLevel } from "../hooks/useLevels";
import ListButton from "../../components/ListButton";
import LevelForm from "./LevelForm";
import LevelFormModal from "./LevelFormModal";
import DeleteButton from "../../components/DeleteButton";

interface Props {
  programId: number;
}

const LevelList = ({ programId }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(
    undefined
  );
  const { data: levels, error, isLoading } = useLevels(programId);
  const deleteLevel = useDeleteLevel(programId);
  useEffect(() => {
    if (levels) setSelectedLevel(levels[0]);
  }, [!!levels]);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <>
      <HStack alignItems="start" spacing={10}>
        <Stack spacing={3}>
          {levels
            ?.sort((a, b) => a.list_index - b.list_index)
            .map((level) => (
              <HStack key={level.id}>
                <ListButton
                  isSelected={selectedLevel?.id === level.id}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level.list_index + ": " + level.title}
                </ListButton>
                <DeleteButton
                  onConfirm={() => {
                    deleteLevel.mutate(level.id);
                  }}
                >
                  {level?.title}
                </DeleteButton>
              </HStack>
            ))}
          <Button onClick={onOpen}>Add level</Button>
        </Stack>
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

export default LevelList;
