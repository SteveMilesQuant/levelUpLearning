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
import StudentFormBody from "./StudentFormBody";
import useStudentForm from "../hooks/useStudentForm";
import SubmitButton from "../../components/SubmitButton";
import CancelButton from "../../components/CancelButton";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const StudentFormModal = ({ title, isOpen, onClose }: Props) => {
  const studentForm = useStudentForm();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        studentForm.handleClose();
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="2xl">{title}</Heading>
          <Divider orientation="horizontal" marginTop={1}></Divider>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <StudentFormBody {...studentForm} />
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="right" spacing={3}>
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <SubmitButton
              onClick={() => {
                studentForm.handleSubmit();
                if (studentForm.isValid) {
                  studentForm.handleClose();
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

export default StudentFormModal;
