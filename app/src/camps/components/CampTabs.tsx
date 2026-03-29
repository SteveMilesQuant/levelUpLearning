import { Tabs, TabList, Tab, TabPanels, TabPanel, Button, Stack } from "@chakra-ui/react";
import { StudentTable } from "../../students";
import { InstructorList } from "../../users";
import { Camp } from "../Camp";
import CampForm from "./CampForm";
import CampTabPublic from "./CampTabPublic";
import useGeneratePickupCodes from "../hooks/useGeneratePickupCodes";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CampsContext, { CampsContextType } from "../campsContext";

interface Props {
  camp: Camp;
  isReadOnly?: boolean;
  isPublicFacing?: boolean;
}

const CampTabs = ({ camp, isReadOnly, isPublicFacing }: Props) => {
  const campsContextType = useContext(CampsContext);
  const navigate = useNavigate();
  const { mutate: generateCodes, isLoading } = useGeneratePickupCodes(camp.id);
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
            <Stack spacing={5}>
              <StudentTable campId={camp.id} isReadOnly={isReadOnly} />
              {campsContextType === CampsContextType.teach && (
                <Button
                  bgColor="brand.buttonBg"
                  onClick={() => navigate(`/teach/${camp.id}/pickup`)}
                >
                  Student Pickup
                </Button>
              )}
              {campsContextType === CampsContextType.schedule &&
                <Button
                  textColor={camp.pickup_codes_generated ? "brand.warning" : "brand.primary"}
                  isLoading={isLoading}
                  onClick={() => generateCodes()}
                >
                  {camp.pickup_codes_generated
                    ? "Regenerate pickup codes"
                    : "Generate pickup codes"}
                </Button>
              }
            </Stack>
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default CampTabs;
