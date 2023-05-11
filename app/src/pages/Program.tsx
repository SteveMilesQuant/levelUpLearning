import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  HStack,
  List,
  ListItem,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import {
  Level,
  useLevels,
  ProgramForm,
  LevelForm,
  LevelFormModal,
  useProgram,
} from "../programs";
import ListButton from "../components/ListButton";

const Program = () => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;

  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(
    undefined
  );

  const {
    data: program,
    error: programError,
    isLoading: loadingProgram,
  } = useProgram(id);
  const {
    data: levels,
    error: levelsError,
    isLoading: loadingLevels,
  } = useLevels(id);

  useEffect(() => {
    if (levels) setSelectedLevel(levels[0]);
  }, [!!levels]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (loadingProgram || loadingLevels || !program || !levels) return null;
  if (programError) throw programError;
  if (levelsError) throw levelsError;

  return (
    <>
      <PageHeader label={program?.title} hideUnderline={true}></PageHeader>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Program</Tab>
          <Tab>Levels</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ProgramForm program={program} isReadOnly={false} />
          </TabPanel>
          <TabPanel>
            <HStack alignItems="start" spacing={10}>
              <Stack spacing={3}>
                {levels
                  ?.sort((a, b) => a.list_index - b.list_index)
                  .map((level) => (
                    <ListButton
                      key={level.id}
                      isSelected={selectedLevel?.id === level.id}
                      onClick={() => setSelectedLevel(level)}
                    >
                      {level.list_index + ": " + level.title}
                    </ListButton>
                  ))}
                <Button onClick={onOpen}>Add level</Button>
              </Stack>
              <Box width="100%">
                {levels
                  ?.filter((level) => level.id === selectedLevel?.id)
                  .map((level) => (
                    <LevelForm
                      key={level.id}
                      programId={program.id}
                      level={level}
                      isReadOnly={false}
                    ></LevelForm>
                  ))}
              </Box>
            </HStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <LevelFormModal
        title="Add level"
        isOpen={isOpen}
        onClose={onClose}
        programId={program.id}
      ></LevelFormModal>
    </>
  );
};

export default Program;
