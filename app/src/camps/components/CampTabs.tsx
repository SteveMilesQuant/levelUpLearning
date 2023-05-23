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
import { useContext } from "react";
import CampsContext, { CampsContextType } from "../campsContext";

interface Props {
  camp: Camp;
}

const CampTabs = ({ camp }: Props) => {
  const deleteCamp = useDeleteCamp();
  const navigate = useNavigate();
  const campsContextType = useContext(CampsContext);

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
        {campsContextType !== CampsContextType.camps && <Tab>Students</Tab>}
      </TabList>
      <TabPanels>
        <TabPanel>
          <ProgramForm program={camp.program} isReadOnly={true} />
          {campsContextType === CampsContextType.schedule && (
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
            isReadOnly={campsContextType !== CampsContextType.schedule}
          />
        </TabPanel>
        <TabPanel>
          <InstructorList
            campId={camp.id}
            isReadOnly={campsContextType !== CampsContextType.schedule}
          />
        </TabPanel>
        {campsContextType !== CampsContextType.camps && (
          <TabPanel>
            <StudentTable
              campId={camp.id}
              isReadOnly={campsContextType !== CampsContextType.schedule}
            />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default CampTabs;
