import { Td, Tr } from "@chakra-ui/react";
import { CACHE_KEY_STUDENTS, Student } from "../Student";
import DeleteButton from "../../components/DeleteButton";
import { useDisenrollStudent } from "../hooks/useCampStudents";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_CAMPS } from "../../camps";

interface Props {
  campId: number;
  student: Student;
}

const StudentRow = ({ campId, student }: Props) => {
  const queryClient = useQueryClient();
  const disenrollStudent = useDisenrollStudent(campId, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          ...CACHE_KEY_STUDENTS,
          student.id.toString(),
          ...CACHE_KEY_CAMPS,
        ],
      });
    },
  });

  return (
    <Tr>
      <Td>{student.name}</Td>
      <Td>{student.grade_level}</Td>
      <Td>
        <DeleteButton
          onConfirm={() => {
            disenrollStudent.mutate(student.id);
          }}
        >
          {student.name}
        </DeleteButton>
      </Td>
    </Tr>
  );
};

export default StudentRow;
