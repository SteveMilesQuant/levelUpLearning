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
  Button,
  ListItem,
  IconButton,
} from "@chakra-ui/react";
import useStudents from "../hooks/useStudents";
import ListButton from "../../components/ListButton";
import { useState } from "react";
import { Camp } from "../../camps";
import { MdAddShoppingCart } from "react-icons/md";
import useShoppingCart from "../../hooks/useShoppingCart";

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
            <ListItem paddingX={3}>
              <Heading fontSize="xl">Available for enrollment:</Heading>
            </ListItem>
            {unenrolledStudents.map((s) => (
              <ListItem paddingX={2} key={s.id}>
                <ListButton
                  isSelected={selectedStudentId === s.id}
                  onClick={() => setSelectedStudentId(s.id)}
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
              </ListItem>
            ))}
            <ListItem paddingX={3}>
              <Heading fontSize="xl">Already enrolled:</Heading>
            </ListItem>
            {enrolledStudents.map((s) => (
              <ListItem paddingX={6} key={s.id}>
                <Text>{s.name}</Text>
              </ListItem>
            ))}
            <ListItem paddingX={3} paddingTop={4}>
              <Button
                variant="outline"
                bgColor="white"
                textColor="brand.100"
                size="md"
                onClick={onClickCreateStudent}
              >
                Create student
              </Button>
            </ListItem>
          </List>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="right">
            <IconButton
              icon={<MdAddShoppingCart size="2em" />}
              aria-label="Navigation"
              size="md"
              color={selectedStudentId ? undefined : "gray.200"}
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
