import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  HStack,
  List,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
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

  useEffect(() => {
    if (levelSchedules) setSelectedLevelSched(levelSchedules[0]);
  }, [levelSchedules === undefined]);

  if (isLoading) return null;
  if (error) throw error;
  if (levelsError) throw levelsError;

  return (
    <>
      <PageHeader label={camp?.program.title} hideUnderline={true}>
        {!forScheduling && (
          <Button size="lg" variant="outline" onClick={newOnOpen}>
            Enroll Student
          </Button>
        )}
      </PageHeader>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Camp</Tab>
          <Tab>Levels</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ProgramForm program={camp?.program} isReadOnly={true} />
          </TabPanel>
          <TabPanel>
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
                      campId={camp.id}
                      levelSchedule={levelSchedule}
                      isReadOnly={!forScheduling}
                    ></LevelScheduleForm>
                  ))}
              </Box>
            </HStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <EnrollStudentModal
        title="Enroll Student"
        campId={camp?.id}
        isOpen={newIsOpen}
        onClose={newOnClose}
      />
    </>
  );
};

export default Camp;
