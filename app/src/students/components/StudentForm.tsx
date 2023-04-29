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
import StudentFormBody from "./StudentFormBody";
import useStudentForm from "../hooks/useStudentForm";
import { Student } from "../Student";
import SubmitButton from "../../components/SubmitButton";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  students?: Student[];
  setStudents?: (student: Student[]) => void;
}

const StudentForm = ({
  title,
  isOpen,
  onClose,
  students,
  setStudents,
}: Props) => {
  const studentForm = useStudentForm({ students, setStudents });

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
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StudentForm;
