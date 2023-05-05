import useStudentForm from "../hooks/useStudentForm";
import { Student } from "../Student";
import EditButtonPopover from "../../components/EditButtonPopover";
import StudentFormBody from "./StudentFormBody";

interface Props {
  student: Student;
}

const StudentFormPopover = ({ student }: Props) => {
  const studentForm = useStudentForm(student);

  return (
    <EditButtonPopover
      title="Update Student"
      onUpdate={studentForm.handleSubmit}
      onClose={studentForm.handleClose}
      holdOpen={!studentForm.isValid}
    >
      <StudentFormBody {...studentForm} />
    </EditButtonPopover>
  );
};

export default StudentFormPopover;
