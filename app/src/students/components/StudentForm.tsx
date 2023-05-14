import { useState } from "react";
import useStudentForm from "../hooks/useStudentForm";
import { Student } from "../Student";
import StudentFormBody from "./StudentFormBody";
import { useDeleteStudent } from "../hooks/useStudents";
import CrudButtonSet from "../../components/CrudButtonSet";

interface Props {
  student: Student;
}

const StudentForm = ({ student }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const studentForm = useStudentForm(student);
  const deleteStudent = useDeleteStudent();

  const handleDelete = () => {
    deleteStudent.mutate(student.id);
  };

  return (
    <>
      <StudentFormBody {...studentForm} isReadOnly={!isEditing} />
      <CrudButtonSet
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onDelete={handleDelete}
        confirmationLabel={student.name}
        onCancel={studentForm.handleClose}
        onSubmit={studentForm.handleSubmit}
        isSubmitValid={studentForm.isValid}
      />
    </>
  );
};

export default StudentForm;
