import useStudentForm from "../hooks/useStudentForm";
import { Student } from "../services/student-service";
import EditButton from "../../components/EditButton";
import StudentFormBody from "./StudentFormBody";

interface Props {
  student: Student;
  onUpdate: (student: Student) => void;
}

const EditStudentButton = ({ student, onUpdate }: Props) => {
  const studentForm = useStudentForm(student, () => {}, onUpdate);

  return (
    <EditButton
      title="Update Student"
      onUpdate={studentForm.handleSubmit}
      onClose={studentForm.handleClose}
    >
      <StudentFormBody {...studentForm} student={student} />
    </EditButton>
  );
};

export default EditStudentButton;
