import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, HStack, List } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {
  LevelSchedule,
  useLevelSchedules,
  LevelScheduleForm,
  useCamp,
} from "../camps";
import { LevelListButton, ProgramForm } from "../programs";

const Camp = () => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;
  const [selectedLevelSched, setSelectedLevelSched] = useState<
    LevelSchedule | undefined
  >(undefined);
  const { data: camp, isLoading, error } = useCamp(id);
  const { data: levelSchedules, error: levelsError } = useLevelSchedules(id);

  if (isLoading) return null;
  if (error) throw error;
  if (levelsError) throw levelsError;

  return (
    <>
      <PageHeader label={camp?.program.title}></PageHeader>
      <HStack alignItems="start" spacing={10}>
        <List spacing={3}>
          <LevelListButton
            isSelected={!selectedLevelSched}
            onClick={() => setSelectedLevelSched(undefined)}
          >
            Camp
          </LevelListButton>
          {levelSchedules?.map((levelSchedule) => (
            <LevelListButton
              key={levelSchedule.level.id}
              isSelected={
                selectedLevelSched?.level.id === levelSchedule.level.id
              }
              onClick={() => setSelectedLevelSched(levelSchedule)}
            >
              {levelSchedule.level?.list_index +
                ": " +
                levelSchedule.level?.title}
            </LevelListButton>
          ))}
        </List>
        <Box width="100%">
          {!selectedLevelSched && <ProgramForm program={camp?.program} />}
          {levelSchedules
            ?.filter(
              (levelSchedule) =>
                levelSchedule.level.id === selectedLevelSched?.level.id
            )
            .map((levelSchedule) => (
              <LevelScheduleForm
                key={levelSchedule.level.id}
                levelSchedule={levelSchedule}
              ></LevelScheduleForm>
            ))}
        </Box>
      </HStack>
    </>
  );
};

export default Camp;
