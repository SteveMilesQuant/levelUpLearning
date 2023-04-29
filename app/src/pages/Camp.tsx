import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, HStack, List, ListItem } from "@chakra-ui/react";
import useCamp from "../camps/hooks/useCamp";
import useLevelSchedules from "../camps/hooks/useLevelSchedules";
import PageHeader from "../components/PageHeader";
import BodyContainer from "../components/BodyContainer";
import { LevelSchedule } from "../camps/LevelSchedule";
import LevelListButton from "../programs/components/LevelListButton";
import ProgramForm from "../programs/components/ProgramForm";
import LevelForm from "../programs/components/LevelForm";
import LevelScheduleForm from "../camps/components/LevelScheduleForm";

const Camp = () => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;
  const [selectedLevelSched, setSelectedLevelSched] = useState<
    LevelSchedule | undefined
  >(undefined);
  const { camp } = useCamp(id);
  const { levelSchedules } = useLevelSchedules(id);

  return (
    <BodyContainer>
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
    </BodyContainer>
  );
};

export default Camp;
