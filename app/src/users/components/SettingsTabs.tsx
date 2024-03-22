import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import InstructorForm from "./InstructorForm";
import ProfileForm from "./ProfileForm";
import useUser from "../hooks/useUser";

const SettingsTabs = () => {
  const { data: user, isLoading, error } = useUser();

  if (isLoading) return null;
  if (error) throw error;

  const isInstructor = !!user.roles.find((r) => r === "INSTRUCTOR");

  return (
    <Tabs variant="enclosed">
      <TabList>
        <Tab>
          <strong>Profile</strong>
        </Tab>
        {isInstructor && (
          <Tab>
            <strong>Instructor Details</strong>
          </Tab>
        )}
      </TabList>
      <TabPanels>
        <TabPanel>
          <ProfileForm user={user} />
        </TabPanel>
        {isInstructor && (
          <TabPanel>
            <InstructorForm instructor={user} />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default SettingsTabs;
