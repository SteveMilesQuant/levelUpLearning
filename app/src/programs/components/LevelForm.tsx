import { HStack } from "@chakra-ui/react";
import useLevelForm from "../hooks/useLevelForm";
import LevelFormBody from "./LevelFormBody";
import { Level } from "../Level";
import ActionButton from "../../components/ActionButton";
import DeleteButton from "../../components/DeleteButton";
import { AiFillEdit } from "react-icons/ai";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import { useState } from "react";
import { useDeleteLevel } from "../hooks/useLevels";

interface Props {
  programId?: number;
  level?: Level;
  isReadOnly?: boolean;
}

const LevelForm = ({ programId, level, isReadOnly }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const levelForm = useLevelForm(programId, level);
  const deleteLevel = useDeleteLevel(programId);

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
          <DeleteButton
            onConfirm={() => deleteLevel.mutate(level?.id)}
            disabled={isEditing}
          >
            {level?.title}
          </DeleteButton>
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
              if (levelForm.isValid) {
                levelForm.handleClose();
                setIsEditing(false);
              }
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
