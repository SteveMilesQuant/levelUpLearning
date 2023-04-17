import {
  Button,
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
import StudentFormBody from "./StudentFormBody";
import useStudentForm from "../hooks/useStudentForm";
import { Student } from "../services/student-service";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Student) => void;
}

const StudentForm = ({ title, isOpen, onClose, onSubmit }: Props) => {
  const studentForm = useStudentForm(null, onClose, onSubmit);

  return (
    <Modal isOpen={isOpen} onClose={studentForm.handleClose}>
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
          <Button variant="outline" onClick={studentForm.handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StudentForm;
