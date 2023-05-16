import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useUserForm from "../hooks/useUserForm";
import { User } from "../User";
import ProfileFormBody from "./ProfileFormBody";
import CrudButtonSet from "../../components/CrudButtonSet";

interface Props {
  user: User;
}

const ProfileForm = ({ user }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const userForm = useUserForm(user);

  return (
    <>
      <ProfileFormBody {...userForm} isReadOnly={!isEditing} />
      <CrudButtonSet
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onCancel={userForm.handleClose}
        onSubmit={userForm.handleSubmit}
        isSubmitValid={userForm.isValid}
      />
    </>
  );
};

export default ProfileForm;
