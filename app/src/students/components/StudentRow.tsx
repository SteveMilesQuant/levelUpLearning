import { HStack, Td, Tr, useDisclosure } from "@chakra-ui/react";
import { CACHE_KEY_STUDENTS, Student } from "../Student";
import DeleteButton from "../../components/DeleteButton";
import { useDisenrollStudent } from "../hooks/useCampStudents";
import { useQueryClient } from "@tanstack/react-query";
import MoveStudentModal from "./MoveStudentModal";
import ActionButton from "../../components/ActionButton";
import { IoMoveOutline } from "react-icons/io5";

interface Props {
  campId: number;
  student: Student;
  isReadOnly?: boolean;
}

const StudentRow = ({ campId, student, isReadOnly }: Props) => {
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


  return (
    <Tr>
      <Td>{student.name}</Td>
      <Td>{student.grade_level}</Td>
      <Td>
        {student.guardians
          ?.map((g) => `${g.full_name} (${g.email_address})`)
          .join(", ")}
      </Td>
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
