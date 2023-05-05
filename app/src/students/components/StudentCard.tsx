import { Box, Card, CardBody, HStack, Heading, Text } from "@chakra-ui/react";
import DeleteButton from "../../components/DeleteButton";
import { Student } from "../Student";
import EditStudentButtonModal from "./EditStudentButtonModal";
import { useDeleteStudent } from "../hooks/useStudents";

interface Props {
  student: Student;
  isSelected: boolean;
  onClick: () => void;
}

const StudentCard = ({ student, isSelected, onClick }: Props) => {
  const deleteStudent = useDeleteStudent();

  return (
    <Card
      bgColor={isSelected ? "gray.300" : ""}
      _hover={{ bgColor: "gray.200" }}
      onClick={onClick}
    >
      <CardBody>
        <HStack justifyContent="space-between">
          <Heading fontSize="2xl">{student.name}</Heading>
          <HStack spacing="3px">
            <EditStudentButtonModal student={student} />
            <DeleteButton onConfirm={() => deleteStudent.mutate(student.id)}>
              {student.name}
            </DeleteButton>
          </HStack>
        </HStack>
        <Box marginTop={2}>
          <Text>Grade {"" + student.grade_level}</Text>
        </Box>
      </CardBody>
    </Card>
  );
};

export default StudentCard;
