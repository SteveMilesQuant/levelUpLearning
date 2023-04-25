import useStudentForm from "../hooks/useStudentForm";
import { Student } from "../services/student-service";
import EditButton from "../../components/EditButton";
import StudentFormBody from "./StudentFormBody";

interface Props {
  student: Student;
  students: Student[];
  setStudents: (students: Student[]) => void;
}

const EditStudentButton = ({ student, students, setStudents }: Props) => {
  const studentForm = useStudentForm({ student, students, setStudents });

  return (
    <EditButton
      title="Update Student"
      onUpdate={studentForm.handleSubmit}
      onClose={studentForm.handleClose}
      holdOpen={!studentForm.isValid}
    >
      <StudentFormBody {...studentForm} />
    </EditButton>
  );
};

export default EditStudentButton;
