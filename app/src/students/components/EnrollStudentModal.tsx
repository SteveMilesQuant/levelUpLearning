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
  IconButton,
  Stack,
  Box,
  Checkbox,
} from "@chakra-ui/react";
import useStudents from "../hooks/useStudents";
import { useState } from "react";
import { Camp, CampsContextType } from "../../camps";
import { MdAddShoppingCart } from "react-icons/md";
import useShoppingCart from "../../hooks/useShoppingCart";
import TextButton from "../../components/TextButton";

enum HalfDayType {
  AM,
  PM,
}

interface Props {
  title: string;
  camp: Camp;
  campsContextType: CampsContextType;
  gradeRange: number[];
  isOpen: boolean;
  onClose: () => void;
  onClickCreateStudent?: () => void;
}

const EnrollStudentModal = ({
  title,
  camp,
  campsContextType,
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
  const [amOrPm, setAmOrPm] = useState<HalfDayType | undefined>(undefined);

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

  const selectAm = () => setAmOrPm(HalfDayType.AM);
  const selectPm = () => setAmOrPm(HalfDayType.PM);

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
              <HStack
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
                justify="space-between"
              >
                <Text>{`${s.name} (Grade ${s.grade_level})`}</Text>
                {campsContextType === CampsContextType.publicHalfDay && s.id === selectedStudentId &&
                  <HStack bgColor="white" borderRadius={10} paddingX={3} paddingY={1}>
                    <Checkbox onChange={selectAm} isChecked={amOrPm !== HalfDayType.PM}>AM</Checkbox>
                    <Checkbox onChange={selectPm} isChecked={amOrPm === HalfDayType.PM}>PM</Checkbox>
                  </HStack>
                }
              </HStack>
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
