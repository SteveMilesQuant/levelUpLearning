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
  List,
} from "@chakra-ui/react";
import SubmitButton from "../../components/SubmitButton";
import useStudents from "../hooks/useStudents";
import ListButton from "../../components/ListButton";
import { useState } from "react";
import useCampStudents, { useEnrollStudent } from "../hooks/useCampStudents";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_STUDENTS } from "../Student";
import { CACHE_KEY_CAMPS } from "../../camps";

interface Props {
  title: string;
  campId?: number;
  isOpen: boolean;
  onClose: () => void;
}

const EnrollStudentModal = ({ title, campId, isOpen, onClose }: Props) => {
  const { data: allStudents, isLoading, error } = useStudents();
  const { data: enrolledStudents } = useCampStudents(campId);
  const [selectedStudentId, setSelectedStudentId] = useState<
    number | undefined
  >(undefined);
  const enrollStudent = useEnrollStudent(campId);
  const queryClient = useQueryClient();

  if (isLoading) return null;
  if (error) throw error;

  const unenrolledStudents = allStudents.filter(
    (student) => !enrolledStudents?.find((s) => s.id === student.id)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSelectedStudentId(undefined);
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
          <List spacing={3}>
            {unenrolledStudents.map((s) => (
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
              if (!selectedStudentId) return;
              enrollStudent.mutate(selectedStudentId);
              queryClient.invalidateQueries({
                queryKey: [
                  ...CACHE_KEY_STUDENTS,
                  selectedStudentId?.toString(),
                  ...CACHE_KEY_CAMPS,
                ],
              });
              setSelectedStudentId(undefined);
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
