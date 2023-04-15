import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import useStudents from "../hooks/useStudents";

const Students = () => {
  const { students, error, isLoading, setStudents, setError } = useStudents();

  return (
    <List padding={10} spacing={5}>
      {students.map((student) => (
        <ListItem key={student.id}>
          <Card width="200px">
            <CardBody>
              <Heading fontSize="2xl">{student.name}</Heading>
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
