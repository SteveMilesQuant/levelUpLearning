import { Tab, TabList, Tabs, TabPanels, TabPanel } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { InstructorFormBody, useUser } from "../users";
import ProfileFormBody from "../users/components/ProfileFormBody";

const Settings = () => {
  const { data: user, isLoading, error } = useUser();

  if (isLoading) return null;
  if (error) throw error;

  const isInstructor = !!user.roles.find((r) => r.name === "INSTRUCTOR");

  return (
    <>
      <PageHeader label="Profiles and settings" />
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Profile</Tab>
          {isInstructor && <Tab>Instructor Details</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>
            <ProfileFormBody user={user} />
          </TabPanel>
          {isInstructor && (
            <TabPanel>
              <InstructorFormBody instructor={user} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Settings;
