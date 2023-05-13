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
  HStack,
} from "@chakra-ui/react";
import CampFormBody from "./CampFormBody";
import useCampForm from "../hooks/useCampForm";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const CampFormModal = ({ title, isOpen, onClose }: Props) => {
  const campForm = useCampForm();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        campForm.handleClose();
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
          <CampFormBody {...campForm} />
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="right" spacing={3}>
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <SubmitButton
              onClick={() => {
                campForm.handleSubmit();
                if (campForm.isValid) {
                  campForm.handleClose();
                  onClose();
                }
              }}
            >
              Submit
            </SubmitButton>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CampFormModal;
