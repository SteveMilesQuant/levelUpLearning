import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
} from "@chakra-ui/react";
import { ProgramForm } from "../../programs";
import { StudentTable } from "../../students";
import { InstructorList } from "../../users";
import { useDeleteCamp } from "../hooks/useCamps";
import LevelScheduleList from "./LevelScheduleList";
import { Camp, CampsPageContext } from "../Camp";
import DeleteButton from "../../components/DeleteButton";
import { useNavigate } from "react-router-dom";

interface Props {
  campsPageContext: CampsPageContext;
  camp: Camp;
}

const CampTabs = ({ campsPageContext, camp }: Props) => {
  const deleteCamp = useDeleteCamp();
  const navigate = useNavigate();

  const handleDelete = () => {
    deleteCamp.mutate(camp.id);
    navigate("/schedule");
  };

  return (
    <Tabs variant="enclosed">
      <TabList>
        <Tab>Camp</Tab>
        <Tab>Levels</Tab>
        <Tab>Instructors</Tab>
        {campsPageContext !== CampsPageContext.camps && <Tab>Students</Tab>}
      </TabList>
      <TabPanels>
        <TabPanel>
          <ProgramForm program={camp.program} isReadOnly={true} />
          {campsPageContext === CampsPageContext.schedule && (
            <HStack justifyContent="right" paddingTop={3}>
              <DeleteButton onConfirm={handleDelete}>
                {camp.program.title}
              </DeleteButton>
            </HStack>
          )}
        </TabPanel>
        <TabPanel>
          <LevelScheduleList
            campId={camp.id}
            campsPageContext={campsPageContext}
          />
        </TabPanel>
        <TabPanel>
          <InstructorList
            campId={camp.id}
            campsPageContext={campsPageContext}
          />
        </TabPanel>
        {campsPageContext !== CampsPageContext.camps && (
          <TabPanel>
            <StudentTable
              campId={camp.id}
              campsPageContext={campsPageContext}
            />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default CampTabs;
