import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { ProgramForm } from "../../programs";
import { StudentTable } from "../../students";
import { InstructorList } from "../../users";
import { CampGetType } from "../hooks/useCamps";
import LevelScheduleList from "./LevelScheduleList";
import { Camp } from "../Camp";

interface Props {
  campGetType: CampGetType;
  camp: Camp;
}

const CampTabs = ({ campGetType, camp }: Props) => {
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
          <ProgramForm program={camp?.program} isReadOnly={true} />
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
