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
  HStack,
  Text,
  ListItem,
  IconButton,
  Stack,
  Box,
} from "@chakra-ui/react";
import useStudents from "../hooks/useStudents";
import { useState } from "react";
import { Camp } from "../../camps";
import { MdAddShoppingCart } from "react-icons/md";
import useShoppingCart from "../../hooks/useShoppingCart";
import TextButton from "../../components/TextButton";

interface Props {
  title: string;
  camp: Camp;
  gradeRange: number[];
  isOpen: boolean;
  onClose: () => void;
  onClickCreateStudent?: () => void;
}

const EnrollStudentModal = ({
  title,
  camp,
  gradeRange,
  isOpen,
  onClose,
  onClickCreateStudent,
}: Props) => {
  const { data: allStudents, isLoading, error } = useStudents();
  const [selectedStudentId, setSelectedStudentId] = useState<
    number | undefined
  >(undefined);
  const { items, addItem } = useShoppingCart();

  if (isLoading) return null;
  if (error) throw error;

  const unenrolledStudents = allStudents.filter(
    (student) =>
      !student.camps.find((s_camp) => s_camp.id === camp.id) &&
      !items.find((i) => i.camp_id === camp.id && i.student_id === student.id)
  );

  const enrolledStudents = allStudents.filter(
    (student) => !unenrolledStudents.find((s) => s.id == student.id)
  );

  // If the camp starts before June, use the current school year
  // Otherwise, use the coming school year
  const campStartDate = camp?.dates ? new Date(camp.dates[0] + "T00:00:00") : new Date();
  const schoolYear = campStartDate.getMonth() < 5 ? campStartDate.getFullYear() - 1 : campStartDate.getFullYear();

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
          <Stack spacing={3}>
            <Heading fontSize="2xl">{title}</Heading>
            <Text fontSize="md">
              Grades ({schoolYear}-{schoolYear + 1} school year):{" "}
              {`${gradeRange[0]} to ${gradeRange[1]}`}
            </Text>
            <Divider orientation="horizontal" marginTop={1}></Divider>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Heading fontSize="xl">Select for enrollment:</Heading>
            {unenrolledStudents.map((s) => (
              <Box
                paddingX={3}
                paddingY={1}
                key={s.id}
                onClick={() => setSelectedStudentId(s.id)}
                bgColor={
                  s.id === selectedStudentId ? "brand.secondary" : undefined
                }
                _hover={{
                  cursor: "pointer",
                }}
                borderRadius={10}
              >
                <Text>{`${s.name} (Grade ${s.grade_level})`}</Text>
              </Box>
            ))}
            {enrolledStudents.length > 0 && (
              <>
                <Heading fontSize="xl">Already enrolled (or in cart):</Heading>
                {enrolledStudents.map((s) => (
                  <Box paddingX={3} paddingY={1} key={s.id}>
                    <Text>{s.name}</Text>
                  </Box>
                ))}
              </>
            )}
            <Box>
              <TextButton onClick={onClickCreateStudent}>
                Create student
              </TextButton>
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="right">
            <IconButton
              icon={<MdAddShoppingCart size="2em" />}
              aria-label="Navigation"
              size="md"
              color={selectedStudentId ? undefined : "brand.disabled"}
              variant="ghost"
              onClick={() => {
                if (selectedStudentId) {
                  addItem({ camp_id: camp.id, student_id: selectedStudentId });
                  onClose();
                }
              }}
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EnrollStudentModal;
