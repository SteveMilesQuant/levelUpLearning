import { useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { ProgramForm, useProgram } from "../programs";
import LevelList from "../programs/components/LevelList";

const Program = () => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;

  const { data: program, error, isLoading } = useProgram(id);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <>
      <PageHeader label={program.title} hideUnderline={true} />
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
    </>
  );
};

export default Program;
