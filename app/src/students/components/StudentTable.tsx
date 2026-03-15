import { Table, TableContainer, Tbody, Thead, Tr } from "@chakra-ui/react";
import { useState } from "react";
import useCampStudents from "../hooks/useCampStudents";
import StudentRow from "./StudentRow";
import ThText from "../../components/ThText";
import AlertMessage from "../../components/AlertMessage";

interface Props {
  campId: number;
  isReadOnly?: boolean;
}

const StudentTable = ({ campId, isReadOnly }: Props) => {
  const { data: students, isLoading, error } = useCampStudents(campId);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <>
      {successMsg && (
        <AlertMessage status="success" onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </AlertMessage>
      )}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <ThText>Name</ThText>
              <ThText>Grade</ThText>
              <ThText>AM/PM</ThText>
              <ThText>Pickup</ThText>
              <ThText>Forms</ThText>
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
                campStudents={students}
                isReadOnly={isReadOnly}
                onPickupSuccess={(name) =>
                  setSuccessMsg(`Pickup by ${name} was successful.`)
                }
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default StudentTable;
