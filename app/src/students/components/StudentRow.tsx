import { HStack, Td, Tr, useDisclosure } from "@chakra-ui/react";
import { CACHE_KEY_STUDENTS, Student } from "../Student";
import DeleteButton from "../../components/DeleteButton";
import { useDisenrollStudent } from "../hooks/useCampStudents";
import { useQueryClient } from "@tanstack/react-query";
import MoveStudentModal from "./MoveStudentModal";
import PickupModal from "./PickupModal";
import ActionButton from "../../components/ActionButton";
import { IoMoveOutline } from "react-icons/io5";
import { MdOutlineDriveEta } from "react-icons/md";
import StudentFormIcons from "./StudentFormIcons";

interface Props {
  campId: number;
  student: Student;
  campStudents: Student[];
  isReadOnly?: boolean;
  onPickupSuccess: (pickupPersonName: string) => void;
}

const StudentRow = ({ campId, student, campStudents, isReadOnly, onPickupSuccess }: Props) => {
  const queryClient = useQueryClient();
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

  const {
    isOpen: pickupIsOpen,
    onOpen: pickupOnOpen,
    onClose: pickupOnClose,
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
      <Td>
        <ActionButton
          Component={MdOutlineDriveEta}
          label="Pickup student"
          onClick={pickupOnOpen}
        />
        <PickupModal
          isOpen={pickupIsOpen}
          onClose={pickupOnClose}
          campId={campId}
          student={student}
          campStudents={campStudents}
          onSuccess={onPickupSuccess}
        />
      </Td>
      <Td><StudentFormIcons student={student} /></Td>
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
