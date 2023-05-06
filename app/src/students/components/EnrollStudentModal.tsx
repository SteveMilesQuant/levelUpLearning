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
  Text,
  List,
} from "@chakra-ui/react";
import SubmitButton from "../../components/SubmitButton";
import useStudents from "../hooks/useStudents";
import ListButton from "../../camps/components/ListButton";
import { useState } from "react";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const EnrollStudentModal = ({ title, isOpen, onClose }: Props) => {
  const { data: students, isLoading, error } = useStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<
    number | undefined
  >(undefined);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="2xl">{title}</Heading>
          <Divider orientation="horizontal" marginTop={1}></Divider>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <List spacing={3}>
            {students.map((s) => (
              <ListButton
                key={s.id}
                isSelected={selectedStudentId === s.id}
                onClick={() => {
                  setSelectedStudentId(s.id);
                }}
              >
                {s.name}
              </ListButton>
            ))}
          </List>
        </ModalBody>
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
