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
        <Tab>
          <strong>Camp</strong>
        </Tab>
        <Tab>
          <strong>Instructors</strong>
        </Tab>
        {!isPublicFacing && (
          <Tab>
            <strong>Students</strong>
          </Tab>
        )}
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
