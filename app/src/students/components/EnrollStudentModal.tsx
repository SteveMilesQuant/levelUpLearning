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
  HStack,
  Text,
} from "@chakra-ui/react";
import SubmitButton from "../../components/SubmitButton";
import useStudents from "../hooks/useStudents";
import ListButton from "../../components/ListButton";
import { useState } from "react";
import { useEnrollStudent } from "../hooks/useCampStudents";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_STUDENTS } from "../Student";
import { CACHE_KEY_CAMPS } from "../../camps";
import CancelButton from "../../components/CancelButton";

interface Props {
  title: string;
  campId: number;
  gradeRange: number[];
  isOpen: boolean;
  onClose: () => void;
}

const EnrollStudentModal = ({
  title,
  campId,
  gradeRange,
  isOpen,
  onClose,
}: Props) => {
  const { data: allStudents, isLoading, error } = useStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<
    number | undefined
  >(undefined);
  const enrollStudent = useEnrollStudent(campId, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...CACHE_KEY_STUDENTS],
        exact: false,
      });
    },
  });
  const queryClient = useQueryClient();

  if (isLoading) return null;
  if (error) throw error;

  const unenrolledStudents = allStudents.filter(
    (student) => !student.camps.find((camp) => camp.id === campId)
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
          <Heading fontSize="2xl" marginY={3}>
            {title}
          </Heading>
          <Text fontSize="md" marginY={3}>
            Camp grade range: {`${gradeRange[0]} to ${gradeRange[1]}`}
          </Text>
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
                <Text
                  color={
                    s.grade_level < gradeRange[0] ||
                    s.grade_level > gradeRange[1]
                      ? "red.400"
                      : undefined
                  }
                >{`${s.name} (Grade ${s.grade_level})`}</Text>
              </ListButton>
            ))}
          </List>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="right" spacing={3}>
            <CancelButton onClick={onClose}>Cancel</CancelButton>
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
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EnrollStudentModal;
