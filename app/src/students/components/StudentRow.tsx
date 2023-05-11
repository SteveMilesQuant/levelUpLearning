import { Td, Tr } from "@chakra-ui/react";
import { Student } from "../Student";
import DeleteButton from "../../components/DeleteButton";
import { useDisenrollStudent } from "../hooks/useCampStudents";

interface Props {
  campId: number;
  student: Student;
}

const StudentRow = ({ campId, student }: Props) => {
  const disenrollStudent = useDisenrollStudent(campId);
  return (
    <Tr>
      <Td>{student.name}</Td>
      <Td>{student.grade_level}</Td>
      <Td>
        <DeleteButton
          onConfirm={() => {
            disenrollStudent.mutate(student.id);
          }}
        >
          {student.name}
        </DeleteButton>
      </Td>
    </Tr>
  );
};

export default StudentRow;
