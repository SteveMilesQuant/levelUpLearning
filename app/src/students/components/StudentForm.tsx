import { useState } from "react";
import useStudentForm from "../hooks/useStudentForm";
import { Student } from "../Student";
import StudentFormBody from "./StudentFormBody";
import { HStack } from "@chakra-ui/react";
import { useDeleteStudent } from "../hooks/useStudents";
import DeleteButton from "../../components/DeleteButton";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import EditButton from "../../components/EditButton";

interface Props {
  student: Student;
}

const StudentForm = ({ student }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const studentForm = useStudentForm(student);
  const deleteStudent = useDeleteStudent();

  return (
    <>
      <StudentFormBody {...studentForm} isReadOnly={!isEditing} />
      <HStack justifyContent="right" spacing={3} paddingTop={3}>
        <EditButton isEditing={isEditing} setIsEditing={setIsEditing} />
        <DeleteButton
          onConfirm={() => {
            deleteStudent.mutate(student.id);
          }}
          disabled={isEditing}
        >
          {student?.name}
        </DeleteButton>
        <CancelButton
          onClick={() => {
            studentForm.handleClose();
            setIsEditing(false);
          }}
          disabled={!isEditing}
        >
          Cancel
        </CancelButton>
        <SubmitButton
          onClick={() => {
            studentForm.handleSubmit();
            if (studentForm.isValid) setIsEditing(false);
          }}
          disabled={!isEditing}
        >
          Update
        </SubmitButton>
      </HStack>
    </>
  );
};

export default StudentForm;
