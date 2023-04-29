import { Button, List, ListItem, useDisclosure } from "@chakra-ui/react";
import useStudents from "../hooks/useStudents";
import StudentCard from "./StudentCard";
import { Student } from "../Student";
import StudentForm from "./StudentForm";

interface Props {
  selectedStudent: Student | null;
  onSelectStudent: (student: Student | null) => void;
}

const StudentList = ({ selectedStudent, onSelectStudent }: Props) => {
  const { data: students, error, isLoading } = useStudents();
  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  if (isLoading) return null;
  if (error) throw error;

  return (
    <>
      <List spacing={5}>
        {students?.map((student) => (
          <ListItem key={student.id}>
            <StudentCard
              student={student}
              isSelected={selectedStudent?.id === student.id}
              onClick={() => onSelectStudent(student)}
            />
          </ListItem>
        ))}
        <ListItem>
          <Button size="lg" variant="outline" onClick={newOnOpen}>
            Add Student
          </Button>
        </ListItem>
      </List>
      <StudentForm
        title="Add Student"
        isOpen={newIsOpen}
        onClose={newOnClose}
      />
    </>
  );
};

export default StudentList;
