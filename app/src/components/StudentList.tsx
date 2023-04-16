import { Button, List, ListItem, useDisclosure } from "@chakra-ui/react";
import useStudents from "../hooks/useStudents";
import StudentCard from "./StudentCard";
import { Student } from "../services/student-service";
import StudentForm from "./StudentForm";
import { produce } from "immer";

interface Props {
  selectedStudent: Student | null;
  onSelectStudent: (student: Student | null) => void;
}

const StudentList = ({ selectedStudent, onSelectStudent }: Props) => {
  const { students, error, isLoading, setStudents, setError } = useStudents();

  const {
    isOpen: newIsOpen,
    onOpen: newOnOpen,
    onClose: newOnClose,
  } = useDisclosure();

  return (
    <>
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
          <Button size="lg" variant="outline" onClick={newOnOpen}>
            Add Student
          </Button>
        </ListItem>
      </List>
      <StudentForm
        title="Add Student"
        isOpen={newIsOpen}
        onClose={newOnClose}
        onAdd={(student) => {
          setStudents(
            produce((draft) => {
              draft.push(student);
            })
          );
        }}
      />
    </>
  );
};

export default StudentList;
