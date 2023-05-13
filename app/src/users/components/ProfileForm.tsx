import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ActionButton from "../../components/ActionButton";
import { AiFillEdit } from "react-icons/ai";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import useUserForm from "../hooks/useUserForm";
import { User } from "../User";
import ProfileFormBody from "./ProfileFormBody";

interface Props {
  user: User;
}

const ProfileForm = ({ user }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const userForm = useUserForm(user);

  // Force a reset when another component (e.g. InstructorForm) updates the user
  useEffect(() => {
    userForm.handleClose();
  }, [user]);

  return (
    <>
      <ProfileFormBody {...userForm} isReadOnly={!isEditing} />
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
    </>
  );
};

export default ProfileForm;
