import {
  Box,
  Heading,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import PageHeader from "../components/PageHeader";
import { useResourceGroups } from "../resources";
import TextButton from "../components/TextButton";

const Resources = () => {
  const { data: resourceGroups, isLoading } = useResourceGroups();

  if (!resourceGroups || isLoading) return <Spinner />;

  return (
    <BodyContainer>
      <PageHeader>Resources</PageHeader>
      <Stack spacing={16}>
        {resourceGroups.length === 0 && <Heading>Coming soon!</Heading>}
        {resourceGroups.length > 0 && (
          <Tabs variant="enclosed">
            <TabList>
              {resourceGroups.map((rg) => (
                <Tab key={rg.id}>{rg.title}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {resourceGroups.map((rg) => (
                <TabPanel key={rg.id}>
                  <Stack spacing={3}>
                    {rg.resources.map((r) => (
                      <Box>
                        <a href={r.url} rel="noopener noreferrer" target="_blank">
                          <TextButton>{r.title}</TextButton>
                        </a>
                      </Box>
                    ))}
                  </Stack>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        )}
        <Box>
          <a href="https://raleighparent.com/camps/" rel="noopener noreferrer" target="_blank">
            <TextButton>Proud to be featured in the Raleigh Parent Camp Guide</TextButton>
          </a>
        </Box>
      </Stack>
    </BodyContainer>
  );
};

export default Resources;
