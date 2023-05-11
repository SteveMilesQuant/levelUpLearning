import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import useCampStudents from "../hooks/useCampStudents";
import StudentRow from "./StudentRow";

interface Props {
  campId: number;
}

const StudentTable = ({ campId }: Props) => {
  const { data: students, isLoading, error } = useCampStudents(campId);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Grade</Th>
          </Tr>
        </Thead>
        <Tbody>
          {students.map((student) => (
            <StudentRow key={student.id} student={student} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
