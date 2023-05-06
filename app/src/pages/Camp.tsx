import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, HStack, List, useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {
  LevelSchedule,
  useLevelSchedules,
  LevelScheduleForm,
  useCamp,
} from "../camps";
import { ProgramForm } from "../programs";
import { EnrollStudentModal } from "../students";
import ListButton from "../camps/components/ListButton";

interface Props {
  forScheduling: boolean;
}

const Camp = ({ forScheduling }: Props) => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;
  const [selectedLevelSched, setSelectedLevelSched] = useState<
    LevelSchedule | undefined
  >(undefined);
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();
  const { data: camp, isLoading, error } = useCamp(id, false);
  const { data: levelSchedules, error: levelsError } = useLevelSchedules(id);

  if (isLoading) return null;
  if (error) throw error;
  if (levelsError) throw levelsError;

  return (
    <>
      <PageHeader label={camp?.program.title}>
        <Button size="lg" variant="outline" onClick={newOnOpen}>
          Enroll Student
        </Button>
      </PageHeader>
      <HStack alignItems="start" spacing={10}>
        <List spacing={3}>
          <ListButton
            isSelected={!selectedLevelSched}
            onClick={() => setSelectedLevelSched(undefined)}
          >
            Camp
          </ListButton>
          {levelSchedules?.map((levelSchedule) => (
            <ListButton
              key={levelSchedule.level.id}
              isSelected={
                selectedLevelSched?.level.id === levelSchedule.level.id
              }
              onClick={() => setSelectedLevelSched(levelSchedule)}
            >
              {levelSchedule.level?.list_index +
                ": " +
                levelSchedule.level?.title}
            </ListButton>
          ))}
        </List>
        <Box width="100%">
          {!selectedLevelSched && (
            <ProgramForm program={camp?.program} isReadOnly={true} />
          )}
          {levelSchedules
            ?.filter(
              (levelSchedule) =>
                levelSchedule.level.id === selectedLevelSched?.level.id
            )
            .map((levelSchedule) => (
              <LevelScheduleForm
                key={levelSchedule.level.id}
                campId={camp.id}
                levelSchedule={levelSchedule}
                isReadOnly={!forScheduling}
              ></LevelScheduleForm>
            ))}
        </Box>
      </HStack>
      <EnrollStudentModal
        title="Enroll Student"
        isOpen={newIsOpen}
        onClose={newOnClose}
      />
    </>
  );
};

export default Camp;
