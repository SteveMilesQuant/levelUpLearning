import { SimpleGrid, useDisclosure, Button } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import usePrograms from "../programs/hooks/usePrograms";
import ProgramCard from "../programs/components/ProgramCard";
import programService from "../programs/program-service";
import { Program } from "../programs/Program";
import produce from "immer";
import PageHeader from "../components/PageHeader";
import ProgramFormModal from "../programs/components/ProgramFormModal";
import ProgramList from "../programs/components/ProgramList";

const Programs = () => {
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  return (
    <BodyContainer>
      <PageHeader label="Programs">
        <Button size="lg" variant="outline" onClick={newOnOpen}>
          Add Program
        </Button>
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
