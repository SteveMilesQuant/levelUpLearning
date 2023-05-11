import { HStack } from "@chakra-ui/react";
import useLevelForm from "../hooks/useLevelForm";
import LevelFormBody from "./LevelFormBody";
import { Level } from "../Level";
import ActionButton from "../../components/ActionButton";
import { AiFillEdit } from "react-icons/ai";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import { useState } from "react";

interface Props {
  programId?: number;
  level?: Level;
  isReadOnly?: boolean;
}

const LevelForm = ({ programId, level, isReadOnly }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const levelForm = useLevelForm(programId, level);

  return (
    <>
      <LevelFormBody {...levelForm} isReadOnly={!isEditing} />
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
              levelForm.handleClose();
              setIsEditing(false);
            }}
            disabled={!isEditing}
          >
            Cancel
          </CancelButton>
          <SubmitButton
            onClick={() => {
              levelForm.handleSubmit();
              if (levelForm.isValid) setIsEditing(false);
            }}
            disabled={!isEditing}
          >
            Update
          </SubmitButton>
        </HStack>
      )}
      ;
    </>
  );
};

export default LevelForm;
