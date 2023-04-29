import useStudentForm from "../hooks/useStudentForm";
import { Student } from "../Student";
import EditButton from "../../components/EditButton";
import StudentFormBody from "./StudentFormBody";

interface Props {
  student: Student;
}

const EditStudentButton = ({ student }: Props) => {
  const studentForm = useStudentForm(student);

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
