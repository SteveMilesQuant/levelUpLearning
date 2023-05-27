import { Box, HStack, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useLevelSchedules from "../hooks/useLevelSchedules";
import { LevelSchedule } from "../LevelSchedule";
import ListButton from "../../components/ListButton";
import LevelScheduleForm from "./LevelScheduleForm";

interface Props {
  campId: number;
  isReadOnly?: boolean;
}

const LevelScheduleList = ({ campId, isReadOnly }: Props) => {
  const { data: levelSchedules, isLoading, error } = useLevelSchedules(campId);

  const [selectedLevelSched, setSelectedLevelSched] = useState<
    LevelSchedule | undefined
  >(undefined);
  useEffect(() => {
    if (levelSchedules) setSelectedLevelSched(levelSchedules[0]);
  }, [!!levelSchedules]);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <HStack alignItems="start" spacing={10}>
      <Stack spacing={3}>
        {levelSchedules?.map((levelSchedule) => (
          <ListButton
            key={levelSchedule.level.id}
            isSelected={selectedLevelSched?.level.id === levelSchedule.level.id}
            onClick={() => setSelectedLevelSched(levelSchedule)}
          >
            {levelSchedule.level?.list_index +
              ": " +
              levelSchedule.level?.title}
          </ListButton>
        ))}
      </Stack>
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
              isReadOnly={isReadOnly}
            ></LevelScheduleForm>
          ))}
      </Box>
    </HStack>
  );
};

export default LevelScheduleList;
