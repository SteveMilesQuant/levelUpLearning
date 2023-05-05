import { Button, List, useDisclosure } from "@chakra-ui/react";
import useStudents from "../hooks/useStudents";
import StudentCard from "./StudentCard";
import { Student } from "../Student";
import StudentFormModal from "./StudentFormModal";

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
          <StudentCard
            student={student}
            isSelected={selectedStudent?.id === student.id}
            onClick={() => onSelectStudent(student)}
            key={student.id}
          />
        ))}
        <Button size="lg" variant="outline" onClick={newOnOpen}>
          Add Student
        </Button>
      </List>
      <StudentFormModal
        title="Add Student"
        isOpen={newIsOpen}
        onClose={newOnClose}
      />
    </>
  );
};

export default StudentList;
