import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { Program } from "../Program";
import LevelList from "./LevelList";
import ProgramForm from "./ProgramForm";

interface Props {
  program: Program;
}

const ProgramTabs = ({ program }: Props) => {
  return (
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
          <LevelList programId={program.id} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ProgramTabs;
