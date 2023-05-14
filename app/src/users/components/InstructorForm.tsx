import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ActionButton from "../../components/ActionButton";
import { AiFillEdit } from "react-icons/ai";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import useUserForm from "../hooks/useUserForm";
import { User } from "../User";
import InstructorFormBody from "./InstructorFormBody";
import DeleteButton from "../../components/DeleteButton";
import { UseMutationResult } from "@tanstack/react-query";
import { DeleteDataContext } from "../../services/api-hooks";

interface Props {
  instructor: User;
  isReadOnly?: boolean;
  deleteInstructor?: UseMutationResult<
    any,
    Error,
    number,
    DeleteDataContext<User>
  >; // delete only needed for InstructorList (within camp)
}

const InstructorForm = ({
  instructor,
  isReadOnly,
  deleteInstructor,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const userForm = useUserForm(instructor);

  // Force a reset when another component (e.g. ProfileForm) updates the instructor
  useEffect(() => {
    userForm.handleClose();
  }, [instructor]);

  return (
    <>
      <InstructorFormBody {...userForm} isReadOnly={isReadOnly || !isEditing} />

      <HStack justifyContent="right" spacing={3} paddingTop={3}>
        {deleteInstructor && (
          <DeleteButton
            onConfirm={() => deleteInstructor.mutate(instructor.id)}
          >
            {instructor.full_name}
          </DeleteButton>
        )}
        {!isReadOnly && (
          <>
            <ActionButton
              Component={AiFillEdit}
              label="Edit"
              onClick={() => setIsEditing(true)}
              disabled={isEditing}
            />

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
          </>
        )}
      </HStack>
    </>
  );
};

export default InstructorForm;
