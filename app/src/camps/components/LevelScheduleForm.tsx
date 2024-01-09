import { LevelSchedule } from "../LevelSchedule";
import LevelScheduleFormBody from "./LevelScheduleFormBody";
import useLevelScheduleForm from "../hooks/useLevelScheduleForm";
import { useState } from "react";
import CrudButtonSet from "../../components/CrudButtonSet";

interface Props {
  campId?: number;
  levelSchedule: LevelSchedule;
  isPublicFacing?: boolean;
  isReadOnly?: boolean;
}

const LevelScheduleForm = ({
  campId,
  levelSchedule,
  isPublicFacing,
  isReadOnly,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const levelScheduleForm = useLevelScheduleForm(campId, levelSchedule);

  return (
    <>
      <LevelScheduleFormBody
        {...levelScheduleForm}
        level={levelSchedule.level}
        isPublicFacing={isPublicFacing}
        isReadOnly={!isEditing}
      />
      {!isReadOnly && (
        <CrudButtonSet
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onCancel={levelScheduleForm.handleClose}
          onSubmit={levelScheduleForm.handleSubmit}
          isSubmitValid={levelScheduleForm.isValid}
        />
      )}
    </>
  );
};

export default LevelScheduleForm;
