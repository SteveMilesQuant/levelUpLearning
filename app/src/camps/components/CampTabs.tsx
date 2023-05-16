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
import { CampGetType, useDeleteCamp } from "../hooks/useCamps";
import LevelScheduleList from "./LevelScheduleList";
import { Camp } from "../Camp";
import DeleteButton from "../../components/DeleteButton";
import { useNavigate } from "react-router-dom";

interface Props {
  campGetType: CampGetType;
  camp: Camp;
}

const CampTabs = ({ campGetType, camp }: Props) => {
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
        {campGetType !== CampGetType.camps && <Tab>Students</Tab>}
      </TabList>
      <TabPanels>
        <TabPanel>
          <ProgramForm program={camp.program} isReadOnly={true} />
          {campGetType === CampGetType.schedule && (
            <HStack justifyContent="right" paddingTop={3}>
              <DeleteButton onConfirm={handleDelete}>
                {camp.program.title}
              </DeleteButton>
            </HStack>
          )}
        </TabPanel>
        <TabPanel>
          <LevelScheduleList campId={camp.id} campGetType={campGetType} />
        </TabPanel>
        <TabPanel>
          <InstructorList campId={camp.id} campGetType={campGetType} />
        </TabPanel>
        {campGetType !== CampGetType.camps && (
          <TabPanel>
            <StudentTable campId={camp.id} campGetType={campGetType} />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default CampTabs;
