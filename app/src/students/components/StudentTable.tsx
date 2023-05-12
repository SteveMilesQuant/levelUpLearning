import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import useCampStudents from "../hooks/useCampStudents";
import StudentRow from "./StudentRow";
import { CampGetType } from "../../camps";

interface Props {
  campId: number;
  campGetType: CampGetType;
}

const StudentTable = ({ campId, campGetType }: Props) => {
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
            {campGetType === CampGetType.schedule && (
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
              campGetType={campGetType}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
