import { Box, HStack, List } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useLevelSchedules from "../hooks/useLevelSchedules";
import { LevelSchedule } from "../LevelSchedule";
import ListButton from "./ListButton";
import LevelScheduleForm from "./LevelScheduleForm";

interface Props {
  campId: number;
  forScheduling: boolean;
}

const LevelScheduleList = ({ campId, forScheduling }: Props) => {
  const { data: levelSchedules, isLoading, error } = useLevelSchedules(campId);

  const [selectedLevelSched, setSelectedLevelSched] = useState<
    LevelSchedule | undefined
  >(undefined);
  useEffect(() => {
    if (levelSchedules) setSelectedLevelSched(levelSchedules[0]);
  }, [levelSchedules === undefined]);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <HStack alignItems="start" spacing={10}>
      <List spacing={3}>
        {levelSchedules?.map((levelSchedule, index) => (
          <ListButton
            key={levelSchedule.level.id}
            isSelected={
              (!selectedLevelSched && index === 0) ||
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
        {levelSchedules
          ?.filter(
            (levelSchedule) =>
              levelSchedule.level.id === selectedLevelSched?.level.id
          )
          .map((levelSchedule) => (
            <LevelScheduleForm
              key={levelSchedule.level.id}
              campId={campId}
              levelSchedule={levelSchedule}
              isReadOnly={!forScheduling}
            ></LevelScheduleForm>
          ))}
      </Box>
    </HStack>
  );
};

export default LevelScheduleList;
