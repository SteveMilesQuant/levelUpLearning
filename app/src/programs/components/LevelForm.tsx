import { HStack } from "@chakra-ui/react";
import useLevelForm from "../hooks/useLevelForm";
import LevelFormBody from "./LevelFormBody";
import { Level } from "../Level";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import { useState } from "react";
import DeleteButton from "../../components/DeleteButton";
import { useDeleteLevel } from "../hooks/useLevels";
import EditButton from "../../components/EditButton";

interface Props {
  programId?: number;
  level: Level;
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
          <EditButton isEditing={isEditing} setIsEditing={setIsEditing} />
          <DeleteButton
            onConfirm={() => {
              deleteLevel.mutate(level.id);
            }}
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
