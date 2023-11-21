import { useDisclosure, Button } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { StudentTabs, StudentFormModal } from "../students";
import BodyContainer from "../components/BodyContainer";

const Students = () => {
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  return (
    <BodyContainer>
      <PageHeader
        hideUnderline={true}
        rightButton={
          <Button size="md" variant="outline" onClick={newOnOpen}>
            Add Student
          </Button>
        }
      >
        My Students
      </PageHeader>
      <StudentTabs />
      <StudentFormModal
        title="Add Student"
        isOpen={newIsOpen}
        onClose={newOnClose}
      />
    </BodyContainer>
  );
};

export default Students;
