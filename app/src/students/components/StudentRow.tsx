import { Td, Tr } from "@chakra-ui/react";
import { Student } from "../Student";

interface Props {
  student: Student;
}

const StudentRow = ({ student }: Props) => {
  return (
    <Tr>
      <Td>{student.name}</Td>
      <Td>{student.grade_level}</Td>
    </Tr>
  );
};

export default StudentRow;
