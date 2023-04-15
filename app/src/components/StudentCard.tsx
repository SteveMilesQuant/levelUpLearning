import { Box, Card, CardBody, HStack, Heading, Text } from "@chakra-ui/react";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import { Student } from "../services/student-service";

interface Props {
  student: Student;
  onEdit: () => void;
  onDelete: () => void;
}

const StudentCard = ({ student, onEdit, onDelete }: Props) => {
  return (
    <Card width="200px" _hover={{ bgColor: "gray.200" }}>
      <CardBody>
        <HStack justifyContent="space-between">
          <Heading fontSize="2xl">{student.name}</Heading>
          <HStack spacing="3px">
            <EditButton onClick={onEdit} />
            <DeleteButton onClick={onDelete} />
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
