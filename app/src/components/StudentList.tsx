import { Button, List, ListItem } from "@chakra-ui/react";
import useStudents from "../hooks/useStudents";
import StudentCard from "./StudentCard";
import { Student } from "../services/student-service";

interface Props {
  selectedStudent: Student | null;
  onSelectStudent: (student: Student | null) => void;
}

const StudentList = ({ selectedStudent, onSelectStudent }: Props) => {
  const { students, error, isLoading, setStudents, setError } = useStudents();

  return (
    <List spacing={5}>
      {students.map((student) => (
        <ListItem key={student.id}>
          <StudentCard
            student={student}
            isSelected={selectedStudent?.id === student.id}
            onClick={() => onSelectStudent(student)}
            onEdit={() => {}}
            onDelete={() => {}}
          />
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

export default StudentList;
