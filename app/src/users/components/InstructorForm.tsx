import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import ActionButton from "../../components/ActionButton";
import { AiFillEdit } from "react-icons/ai";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import useUserForm from "../hooks/useUserForm";
import { User } from "../User";
import InstructorFormBody from "./InstructorFormBody";

interface Props {
  instructor: User;
  isReadOnly?: boolean;
}

const InstructorForm = ({ instructor, isReadOnly }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const userForm = useUserForm(instructor);

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
