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
import { Camp } from "../Camp";
import DeleteButton from "../../components/DeleteButton";
import { useNavigate } from "react-router-dom";

interface Props {
  camp: Camp;
  isReadOnly?: boolean;
  showStudents?: boolean;
}

const CampTabs = ({ camp, isReadOnly, showStudents }: Props) => {
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
        {showStudents && <Tab>Students</Tab>}
      </TabList>
      <TabPanels>
        <TabPanel>
          <ProgramForm program={camp.program} isReadOnly={true} />
          {!isReadOnly && (
            <HStack justifyContent="right" paddingTop={3}>
              <DeleteButton onConfirm={handleDelete}>
                {camp.program.title}
              </DeleteButton>
            </HStack>
          )}
        </TabPanel>
        <TabPanel width="100%">
          <LevelScheduleList campId={camp.id} isReadOnly={isReadOnly} />
        </TabPanel>
        <TabPanel>
          <InstructorList campId={camp.id} isReadOnly={isReadOnly} />
        </TabPanel>
        {showStudents && (
          <TabPanel>
            <StudentTable campId={camp.id} isReadOnly={isReadOnly} />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default CampTabs;
