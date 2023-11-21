import { useDisclosure, Button } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { ProgramFormModal } from "../programs";
import { ProgramList } from "../programs";

const Programs = () => {
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  return (
    <>
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
    </>
  );
};

export default Programs;
