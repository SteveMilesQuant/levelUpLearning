import { HStack, TabList, TabPanel, TabPanels, Tabs, useBreakpointValue } from "@chakra-ui/react";
import GoofyTab from "../components/GoofyTab";
import MissionPanel from "../components/MissionPanel";
import FAQPanel from "../components/FAQPanel";
import SchedulePanel from "../components/SchedulePanel";
import TeachersPanel from "../components/TeachersPanel";

const About = () => {
  // const orientation: "vertical" | "horizontal" | undefined = useBreakpointValue({ base: "vertical", xl: "horizontal" });
  const orientation = "horizontal";
  const panelPaddingX = { base: 2, xl: 4 };
  const panelPaddingY = { base: 4, xl: 4 };

  return (
    <HStack justifyContent="center" w="full">
      <Tabs
        variant="enclosed"
        marginX={3}
        marginY={{ base: 3, xl: 14 }}
        orientation={orientation}
      // display={{ base: "flex", xl: "block" }}
      // flexDirection={{ base: "row-reverse", xl: undefined }}
      >
        <TabList gap={{ base: 0.5, xl: 2 }}>
          <GoofyTab bgColor="#040098">Our Mission</GoofyTab>
          <GoofyTab bgColor="#bffc71">Our Schedule</GoofyTab>
          <GoofyTab bgColor="#3dd8ed">Our Teachers</GoofyTab>
          <GoofyTab bgColor="#76aaee">Our FAQ</GoofyTab>
        </TabList>
        <TabPanels>
          <TabPanel bgColor="#040098" textColor="white" paddingX={panelPaddingX} paddingY={panelPaddingY}>
            <MissionPanel />
          </TabPanel>
          <TabPanel bgColor={{ base: "#ffee59", md: "#bffc71" }} textColor="white" paddingX={panelPaddingX} paddingY={panelPaddingY}>
            <SchedulePanel />
          </TabPanel>
          <TabPanel bgColor="#3dd8ed" textColor="white" paddingX={panelPaddingX} paddingY={panelPaddingY} >
            <TeachersPanel />
          </TabPanel>
          <TabPanel bgColor="#76aaee" textColor="white" paddingX={panelPaddingX} paddingY={panelPaddingY} >
            <FAQPanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </HStack>
  );
};

export default About;
