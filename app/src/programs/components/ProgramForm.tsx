import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Divider,
  Heading,
} from "@chakra-ui/react";
import ProgramFormBody from "./ProgramFormBody";
import useProgramForm from "../hooks/useProgramForm";
import { Program } from "../services/program-service";
import SubmitButton from "../../components/SubmitButton";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (program: Program) => void;
}

const ProgramForm = ({ title, isOpen, onClose, onSubmit }: Props) => {
  const programForm = useProgramForm(null, onClose, onSubmit);

  return (
    <Modal isOpen={isOpen} onClose={programForm.handleClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="2xl">{title}</Heading>
          <Divider orientation="horizontal" marginTop={1}></Divider>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ProgramFormBody {...programForm} />
        </ModalBody>
        <ModalFooter>
          <SubmitButton onClick={programForm.handleSubmit}>Submit</SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProgramForm;
