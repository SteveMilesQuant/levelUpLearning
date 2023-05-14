import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ActionButton from "../../components/ActionButton";
import { AiFillEdit } from "react-icons/ai";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import useUserForm from "../hooks/useUserForm";
import { User } from "../User";
import InstructorFormBody from "./InstructorFormBody";
import { useDeleteCampInstructor } from "../hooks/useInstructors";
import DeleteButton from "../../components/DeleteButton";

interface Props {
  campId?: number;
  instructor: User;
  isReadOnly?: boolean;
}

const InstructorForm = ({ campId, instructor, isReadOnly }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const deleteInstructor = useDeleteCampInstructor(campId);
  const userForm = useUserForm(instructor);

  // Force a reset when another component (e.g. ProfileForm) updates the instructor
  useEffect(() => {
    userForm.handleClose();
  }, [instructor]);

  return (
    <>
      <InstructorFormBody {...userForm} isReadOnly={isReadOnly || !isEditing} />
      {!isReadOnly && (
        <HStack justifyContent="right" spacing={3} paddingTop={3}>
          <ActionButton
            Component={AiFillEdit}
            label="Edit"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
          />
          <DeleteButton
            onConfirm={() => deleteInstructor.mutate(instructor.id)}
          >
            {instructor.full_name}
          </DeleteButton>
          <CancelButton
            onClick={() => {
              userForm.handleClose();
              setIsEditing(false);
            }}
            disabled={!isEditing}
          >
            Cancel
          </CancelButton>
          <SubmitButton
            onClick={() => {
              userForm.handleSubmit();
              if (userForm.isValid) setIsEditing(false);
            }}
            disabled={!isEditing}
          >
            Update
          </SubmitButton>
        </HStack>
      )}
    </>
  );
};

export default InstructorForm;
