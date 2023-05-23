import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import useCampStudents from "../hooks/useCampStudents";
import StudentRow from "./StudentRow";

interface Props {
  campId: number;
  isReadOnly?: boolean;
}

const StudentTable = ({ campId, isReadOnly }: Props) => {
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
            <Th>Guardians</Th>
            {!isReadOnly && (
              <Th>
                {/* Placeholder for delete button, which needs no header */}
              </Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {students.map((student) => (
            <StudentRow
              key={student.id}
              campId={campId}
              student={student}
              isReadOnly={isReadOnly}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
