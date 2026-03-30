import { HStack, Td, Tr, useDisclosure } from "@chakra-ui/react";
import { useContext } from "react";
import { CACHE_KEY_STUDENTS, Student } from "../Student";
import DeleteButton from "../../components/DeleteButton";
import { useDisenrollStudent } from "../hooks/useCampStudents";
import { useQueryClient } from "@tanstack/react-query";
import MoveStudentModal from "./MoveStudentModal";
import ActionButton from "../../components/ActionButton";
import { IoMoveOutline } from "react-icons/io5";
import StudentFormIcons from "./StudentFormIcons";
import StudentPickupIcon from "./StudentPickupIcon";
import ManualPickupIcon from "./ManualPickupIcon";
import CampsContext, { CampsContextType } from "../../camps/campsContext";

interface Props {
  campId: number;
  student: Student;
  isReadOnly?: boolean;
}

const StudentRow = ({ campId, student, isReadOnly }: Props) => {
  const queryClient = useQueryClient();
  const campsContextType = useContext(CampsContext);
  const isSchedule = campsContextType === CampsContextType.schedule;
  const isTeaching = campsContextType === CampsContextType.teach;
  const disenrollStudent = useDisenrollStudent(campId, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEY_STUDENTS,
        exact: false,
      });
    },
  });

  const {
    isOpen: moveStudentIsOpen,
    onOpen: moveStudentOnOpen,
    onClose: moveStudentOnClose,
  } = useDisclosure();

  const camp = student.student_camps.find(
    (c) => c.id === campId
  );
  const campHalfDayStr = camp?.half_day ? camp?.half_day : "Full day";

  return (
    <Tr>
      <Td>{student.name}</Td>
      <Td>{student.grade_level}</Td>
      <Td>{campHalfDayStr}</Td>
      <Td><StudentFormIcons student={student} /></Td>
      {isTeaching && (
        <Td><ManualPickupIcon campId={campId} studentId={student.id} studentName={student.name} /></Td>
      )}
      {isSchedule && (
        <Td><StudentPickupIcon campId={campId} studentId={student.id} studentName={student.name} /></Td>
      )}
      {!isReadOnly && (
        <>
          <Td>
            <HStack spacing={3}>
              <DeleteButton
                onConfirm={() => {
                  disenrollStudent.mutate(student.id);
                }}
              >
                {student.name}
              </DeleteButton>
              <ActionButton
                Component={IoMoveOutline}
                label="Move student"
                onClick={moveStudentOnOpen}
              />
            </HStack>
            <MoveStudentModal student={student} campId={campId} isOpen={moveStudentIsOpen} onClose={moveStudentOnClose} />
          </Td>
        </>
      )
      }
    </Tr >
  );
};

export default StudentRow;
