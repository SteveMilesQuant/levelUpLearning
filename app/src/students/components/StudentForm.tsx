import { useState } from "react";
import useStudentForm from "../hooks/useStudentForm";
import { CACHE_KEY_STUDENTS, Student } from "../Student";
import StudentFormBody from "./StudentFormBody";
import { useDeleteStudent } from "../hooks/useStudents";
import CrudButtonSet from "../../components/CrudButtonSet";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_CAMPS } from "../../camps";

interface Props {
  student: Student;
}

const StudentForm = ({ student }: Props) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const studentForm = useStudentForm(student);
  const deleteStudent = useDeleteStudent({
    onSuccess: () => {
      student.camps.forEach((camp) => {
        queryClient.removeQueries({
          queryKey: [
            ...CACHE_KEY_CAMPS,
            camp.id.toString(),
            ...CACHE_KEY_STUDENTS,
            student.id.toString(),
          ],
          exact: false,
        });

        // Actually remove here, to prevent nested queries on invalid students
        queryClient.removeQueries({
          queryKey: [
            ...CACHE_KEY_CAMPS,
            camp.id.toString(),
            ...CACHE_KEY_STUDENTS,
          ],
        });
      });
    },
  });

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
