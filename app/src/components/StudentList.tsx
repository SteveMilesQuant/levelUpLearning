import { Button, List, ListItem, useDisclosure } from "@chakra-ui/react";
import useStudents from "../hooks/useStudents";
import StudentCard from "./StudentCard";
import studentService, { Student } from "../services/student-service";
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

  const handleEditStudent = (student: Student) => {
    console.log(student);
  };

  const handleDeleteStudent = (student: Student) => {
    const origStudents = students;
    setStudents(
      produce((draft) => {
        const index = draft.findIndex((s) => s.id === student.id);
        if (index >= 0) draft.splice(index, 1);
      })
    );
    onSelectStudent(null);
    studentService.delete(student.id).catch(() => {
      setStudents(origStudents);
    });
  };

  return (
    <>
      <List spacing={5}>
        {students.map((student) => (
          <ListItem key={student.id}>
            <StudentCard
              student={student}
              isSelected={selectedStudent?.id === student.id}
              onClick={() => onSelectStudent(student)}
              onUpdate={() => handleEditStudent(student)}
              onDelete={() => handleDeleteStudent(student)}
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
        onSubmit={(student) => {
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
