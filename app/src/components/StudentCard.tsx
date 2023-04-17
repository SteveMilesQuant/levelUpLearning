import { Box, Card, CardBody, HStack, Heading, Text } from "@chakra-ui/react";
import DeleteButton from "./DeleteButton";
import { Student } from "../services/student-service";
import EditStudentButton from "./EditStudentButton";

interface Props {
  student: Student;
  isSelected: boolean;
  onClick: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const StudentCard = ({
  student,
  isSelected,
  onClick,
  onUpdate,
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
            {onUpdate && (
              <EditStudentButton onUpdate={onUpdate} student={student} />
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
