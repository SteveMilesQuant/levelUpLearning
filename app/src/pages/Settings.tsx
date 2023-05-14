import { Tab, TabList, Tabs, TabPanels, TabPanel } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { InstructorForm, useUser } from "../users";
import { ProfileForm } from "../users";

const Settings = () => {
  const { data: user, isLoading, error } = useUser();

  if (isLoading) return null;
  if (error) throw error;

  const isInstructor = !!user.roles.find((r) => r.name === "INSTRUCTOR");

  return (
    <>
      <PageHeader hideUnderline={true}>Profile and settings</PageHeader>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Profile</Tab>
          {isInstructor && <Tab>Instructor Details</Tab>}
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
    </>
  );
};

export default Settings;
