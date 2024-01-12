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
import { Camp } from "../Camp";
import DeleteButton from "../../components/DeleteButton";
import { useNavigate } from "react-router-dom";
import LevelList from "../../programs/components/LevelList";
import CampForm from "./CampForm";
import CampTabPublic from "./CampTabPublic";

interface Props {
  camp: Camp;
  isReadOnly?: boolean;
  isPublicFacing?: boolean;
}

const CampTabs = ({ camp, isReadOnly, isPublicFacing }: Props) => {
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
        <Tab>Instructors</Tab>
        {!isPublicFacing && <Tab>Students</Tab>}
      </TabList>
      <TabPanels>
        <TabPanel>
          {isReadOnly && <CampTabPublic camp={camp} />}
          {!isReadOnly && (
            <>
              <CampForm camp={camp} isReadOnly={isReadOnly} />
              <HStack justifyContent="right" paddingTop={3}>
                <DeleteButton onConfirm={handleDelete}>
                  {camp.program.title}
                </DeleteButton>
              </HStack>
            </>
          )}
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
