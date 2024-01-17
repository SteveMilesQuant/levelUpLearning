import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { StudentTable } from "../../students";
import { InstructorList } from "../../users";
import { Camp } from "../Camp";
import CampForm from "./CampForm";
import CampTabPublic from "./CampTabPublic";

interface Props {
  camp: Camp;
  isReadOnly?: boolean;
  isPublicFacing?: boolean;
}

const CampTabs = ({ camp, isReadOnly, isPublicFacing }: Props) => {
  return (
    <Tabs variant="enclosed">
      <TabList>
        <Tab>Camp</Tab>
        <Tab>Instructors</Tab>
        {!isPublicFacing && <Tab>Students</Tab>}
      </TabList>
      <TabPanels>
        <TabPanel>
          {isReadOnly && <CampTabPublic camp={camp} />}
          {!isReadOnly && <CampForm camp={camp} />}
        </TabPanel>
        <TabPanel>
          <InstructorList
            campId={camp.id}
            isPublicFacing={isPublicFacing}
            isReadOnly={isReadOnly}
          />
        </TabPanel>
        {!isPublicFacing && (
          <TabPanel>
            <StudentTable campId={camp.id} isReadOnly={isReadOnly} />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default CampTabs;
