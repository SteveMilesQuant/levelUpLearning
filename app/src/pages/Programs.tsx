import { useDisclosure } from "@chakra-ui/react";
import PageHeader from "../components/PageHeader";
import { ProgramFormModal } from "../programs";
import { ProgramList } from "../programs";
import BodyContainer from "../components/BodyContainer";
import TextButton from "../components/TextButton";

const Programs = () => {
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  return (
    <BodyContainer>
      <PageHeader
        rightButton={<TextButton onClick={newOnOpen}>Add Program</TextButton>}
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
