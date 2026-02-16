import { Table, TableContainer, Tbody, Thead, Tr } from "@chakra-ui/react";
import useCampStudents from "../hooks/useCampStudents";
import StudentRow from "./StudentRow";
import ThText from "../../components/ThText";

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
            <ThText>Name</ThText>
            <ThText>Grade</ThText>
            <ThText>Guardians</ThText>
            <ThText>AM/PM</ThText>
            {!isReadOnly && (
              <ThText>
                {/* Placeholder for delete button, which needs no header */}
              </ThText>
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
