import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { Program } from "../Program";
import LevelsPage from "./LevelsPage";
import ProgramForm from "./ProgramForm";

interface Props {
  program: Program;
}

const ProgramTabs = ({ program }: Props) => {
  return (
    <Tabs variant="enclosed">
      <TabList>
        <Tab>
          <strong>Program</strong>
        </Tab>
        <Tab>
          <strong>Levels</strong>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ProgramForm program={program} isReadOnly={false} />
        </TabPanel>
        <TabPanel>
          <LevelsPage programId={program.id} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ProgramTabs;
