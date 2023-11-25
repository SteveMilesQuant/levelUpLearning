import useLevelForm from "../hooks/useLevelForm";
import LevelFormBody from "./LevelFormBody";
import { Level } from "../Level";
import { useState } from "react";
import { useDeleteLevel } from "../hooks/useLevels";
import CrudButtonSet from "../../components/CrudButtonSet";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_CAMPS } from "../../camps";

interface Props {
  programId?: number;
  level: Level;
  isReadOnly?: boolean;
}

const LevelForm = ({ programId, level, isReadOnly }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const levelForm = useLevelForm(programId, level);
  const deleteLevel = useDeleteLevel(programId, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CACHE_KEY_CAMPS,
        exact: false,
      });
    },
  });

  const handleDelete = () => {
    deleteLevel.mutate(level.id);
  };

  return (
    <>
      <LevelFormBody {...levelForm} isReadOnly={!isEditing} />
      {!isReadOnly && (
        <CrudButtonSet
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onDelete={handleDelete}
          confirmationLabel={level?.title}
          onCancel={levelForm.handleClose}
          onSubmit={levelForm.handleSubmit}
          isSubmitValid={levelForm.isValid}
        />
      )}
    </>
  );
};

export default LevelForm;
