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
import SubmitButton from "../../components/SubmitButton";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProgramFormModal = ({ title, isOpen, onClose }: Props) => {
  const programForm = useProgramForm();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        programForm.handleClose();
        onClose();
      }}
      size="3xl"
    >
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
          <SubmitButton
            onClick={() => {
              programForm.handleSubmit();
              if (programForm.isValid) {
                programForm.handleClose();
                onClose();
              }
            }}
          >
            Submit
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProgramFormModal;
