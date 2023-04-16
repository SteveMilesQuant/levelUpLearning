import { Box, Card, CardBody, HStack, Heading, Text } from "@chakra-ui/react";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import { Student } from "../services/student-service";

interface Props {
  student: Student;
  isSelected: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const StudentCard = ({
  student,
  isSelected,
  onClick,
  onEdit,
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
            {onEdit && <EditButton onClick={onEdit} />}
            {onDelete && (
              <DeleteButton objName={student.name} onConfirm={onDelete} />
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
