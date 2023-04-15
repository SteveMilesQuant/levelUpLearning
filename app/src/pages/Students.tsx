import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Icon,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import useStudents from "../hooks/useStudents";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

const Students = () => {
  const { students, error, isLoading, setStudents, setError } = useStudents();

  return (
    <List padding={10} spacing={5}>
      {students.map((student) => (
        <ListItem key={student.id}>
          <Card width="200px">
            <CardBody>
              <HStack justifyContent="space-between">
                <Heading fontSize="2xl">{student.name}</Heading>
                <HStack spacing={2}>
                  <Icon size="md" as={AiFillEdit} />
                  <Icon size="md" as={AiFillDelete} />
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
