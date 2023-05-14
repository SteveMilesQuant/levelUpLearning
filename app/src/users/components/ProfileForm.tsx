import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import useUserForm from "../hooks/useUserForm";
import { User } from "../User";
import ProfileFormBody from "./ProfileFormBody";
import EditButton from "../../components/EditButton";

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
        <EditButton isEditing={isEditing} setIsEditing={setIsEditing} />
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
