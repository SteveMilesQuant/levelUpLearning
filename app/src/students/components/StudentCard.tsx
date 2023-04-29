import { Box, Card, CardBody, HStack, Heading, Text } from "@chakra-ui/react";
import DeleteButton from "../../components/DeleteButton";
import { Student } from "../Student";
import EditStudentButton from "./EditStudentButton";

interface Props {
  student: Student;
  students: Student[];
  setStudents: (students: Student[]) => void;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: () => void;
}

const StudentCard = ({
  student,
  students,
  setStudents,
  isSelected,
  onClick,
  onDelete,
}: Props) => {
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
            {setStudents && (
              <EditStudentButton
                student={student}
                students={students}
                setStudents={setStudents}
              />
            )}
            {onDelete && (
              <DeleteButton onConfirm={onDelete}>{student.name}</DeleteButton>
            )}
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
