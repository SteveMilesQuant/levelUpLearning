import {
  IconButton,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import { ResourceGroupFormModal, useResourceGroups } from "../resources";
import PageHeader from "../components/PageHeader";
import TextButton from "../components/TextButton";
import ResourceGroupForm from "../resources/components/ResourceGroupForm";

const Equip = () => {
  const {
    data: resourceGroups,
    isLoading,
    isError,
    error,
  } = useResourceGroups();
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  if (isError) throw error;
  if (isLoading) return <Spinner />;

  return (
    <BodyContainer>
      <PageHeader
        rightButton={<TextButton onClick={newOnOpen}>Add Group</TextButton>}
      >
        Edit Resources
      </PageHeader>
      <Tabs variant="enclosed">
        <TabList>
          {resourceGroups.map((rg) => (
            <Tab key={rg.id}>{rg.title}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {resourceGroups.map((rg) => (
            <TabPanel key={rg.id}>
              <ResourceGroupForm resourceGroup={rg} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <ResourceGroupFormModal
        title="Add Resource Group"
        isOpen={newIsOpen}
        onClose={newOnClose}
      />
    </BodyContainer>
  );
};

export default Equip;
