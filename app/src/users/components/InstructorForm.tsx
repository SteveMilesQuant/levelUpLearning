import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useUserForm from "../hooks/useUserForm";
import { User } from "../User";
import InstructorFormBody from "./InstructorFormBody";
import DeleteButton from "../../components/DeleteButton";
import { UseMutationResult } from "@tanstack/react-query";
import { DeleteDataContext } from "../../services/api-hooks";
import CrudButtonSet from "../../components/CrudButtonSet";

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

  return (
    <>
      <InstructorFormBody {...userForm} isReadOnly={!isEditing} />

      <HStack justifyContent="right" spacing={3} paddingTop={3}>
        {deleteInstructor && (
          <DeleteButton
            onConfirm={() => deleteInstructor.mutate(instructor.id)}
          >
            {instructor.full_name}
          </DeleteButton>
        )}
        {!isReadOnly && (
          <CrudButtonSet
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onCancel={userForm.handleClose}
            onSubmit={userForm.handleSubmit}
            isSubmitValid={userForm.isValid}
          />
        )}
      </HStack>
    </>
  );
};

export default InstructorForm;
