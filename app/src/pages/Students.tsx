import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import useStudents from "../hooks/useStudents";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";

const Students = () => {
  const { students, error, isLoading, setStudents, setError } = useStudents();

  return (
    <List padding={10} spacing={5}>
      {students.map((student) => (
        <ListItem key={student.id}>
          <Card width="200px" _hover={{ bgColor: "gray.200" }}>
            <CardBody>
              <HStack justifyContent="space-between">
                <Heading fontSize="2xl">{student.name}</Heading>
                <HStack spacing="3px">
                  <EditButton onClick={() => {}} />
                  <DeleteButton onClick={() => {}} />
                </HStack>
              </HStack>
              <Box marginTop={2}>
                <Text>Grade {"" + student.grade_level}</Text>
              </Box>
            </CardBody>
          </Card>
        </ListItem>
      ))}
      <ListItem>
        <Button size="lg" variant="outline">
          Add Student
        </Button>
      </ListItem>
    </List>
  );
};

export default Students;
