import { Td, Tr } from "@chakra-ui/react";
import { CACHE_KEY_STUDENTS, Student } from "../Student";
import DeleteButton from "../../components/DeleteButton";
import { useDisenrollStudent } from "../hooks/useCampStudents";
import { useQueryClient } from "@tanstack/react-query";
import { CampGetType } from "../../camps";

interface Props {
  campId: number;
  campGetType: CampGetType;
  student: Student;
}

const StudentRow = ({ campId, campGetType, student }: Props) => {
  const queryClient = useQueryClient();
  const disenrollStudent = useDisenrollStudent(campId, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEY_STUDENTS,
        exact: false,
      });
    },
  });

  return (
    <Tr>
      <Td>{student.name}</Td>
      <Td>{student.grade_level}</Td>
      <Td>
        {student.guardians
          ?.map((g) => `${g.full_name} (${g.email_address})`)
          .join(", ")}
      </Td>
      {campGetType === CampGetType.schedule && (
        <Td>
          <DeleteButton
            onConfirm={() => {
              disenrollStudent.mutate(student.id);
            }}
          >
            {student.name}
          </DeleteButton>
        </Td>
      )}
    </Tr>
  );
};

export default StudentRow;
