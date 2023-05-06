import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  Heading,
  Divider,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import SubmitButton from "../../components/SubmitButton";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const EnrollStudentModal = ({ title, isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="2xl">{title}</Heading>
          <Divider orientation="horizontal" marginTop={1}></Divider>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
        <ModalFooter>
          <SubmitButton
            onClick={() => {
              onClose();
            }}
          >
            Submit
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EnrollStudentModal;
