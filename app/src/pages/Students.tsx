import { useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { StudentTabs, StudentFormModal } from "../students";
import BodyContainer from "../components/BodyContainer";
import TextButton from "../components/TextButton";

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
        rightButton={<TextButton onClick={newOnOpen}>Add Student</TextButton>}
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
