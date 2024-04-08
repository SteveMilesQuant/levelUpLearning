import {
  Box,
  Heading,
  LinkBox,
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
import { Link as RouterLink } from "react-router-dom";
import TextButton from "../components/TextButton";

const Resources = () => {
  const { data: resourceGroups, isLoading } = useResourceGroups();

  if (!resourceGroups || isLoading) return <Spinner />;

  return (
    <BodyContainer>
      <PageHeader>Resources</PageHeader>
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
    </BodyContainer>
  );
};

export default Resources;
