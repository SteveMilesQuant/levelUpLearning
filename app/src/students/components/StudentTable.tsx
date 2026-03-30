import { Table, TableContainer, Tbody, Thead, Tr } from "@chakra-ui/react";
import { useContext } from "react";
import useCampStudents from "../hooks/useCampStudents";
import StudentRow from "./StudentRow";
import ThText from "../../components/ThText";
import CampsContext, { CampsContextType } from "../../camps/campsContext";

interface Props {
  campId: number;
  isReadOnly?: boolean;
}

const StudentTable = ({ campId, isReadOnly }: Props) => {
  const { data: students, isLoading, error } = useCampStudents(campId);
  const campsContextType = useContext(CampsContext);
  const isSchedule = campsContextType === CampsContextType.schedule;
  const isTeaching = campsContextType === CampsContextType.teach;

  if (isLoading) return null;
  if (error) throw error;

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <ThText>Name</ThText>
            <ThText>Grade</ThText>
            <ThText>AM/PM</ThText>
            <ThText>Forms</ThText>
            {isTeaching && <ThText>Manual Pickup</ThText>}
            {isSchedule && <ThText>Pickup</ThText>}
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
