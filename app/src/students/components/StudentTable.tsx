import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import useCampStudents from "../hooks/useCampStudents";
import StudentRow from "./StudentRow";
import { CampsPageContext } from "../../camps";

interface Props {
  campId: number;
  campsPageContext: CampsPageContext;
}

const StudentTable = ({ campId, campsPageContext }: Props) => {
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
            {campsPageContext === CampsPageContext.schedule && (
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
              campsPageContext={campsPageContext}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
