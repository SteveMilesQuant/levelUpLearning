import { useDisclosure, Button } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { StudentTabs, StudentFormModal } from "../students";

const Students = () => {
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  return (
    <>
      <PageHeader
        hideUnderline={true}
        rightButton={
          <Button size="lg" variant="outline" onClick={newOnOpen}>
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
    </>
  );
};

export default Students;
