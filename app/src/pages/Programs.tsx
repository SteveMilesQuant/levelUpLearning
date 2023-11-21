import { useDisclosure, Button } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { ProgramFormModal } from "../programs";
import { ProgramList } from "../programs";
import BodyContainer from "../components/BodyContainer";

const Programs = () => {
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  return (
    <BodyContainer>
      <PageHeader
        rightButton={
          <Button size="md" variant="outline" onClick={newOnOpen}>
            Add Program
          </Button>
        }
      >
        Programs
      </PageHeader>
      <ProgramList />
      <ProgramFormModal
        title="Add Program"
        isOpen={newIsOpen}
        onClose={newOnClose}
      />
    </BodyContainer>
  );
};

export default Programs;
