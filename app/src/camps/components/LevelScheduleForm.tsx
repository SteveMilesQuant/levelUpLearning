import { LevelSchedule } from "../LevelSchedule";
import LevelScheduleFormBody from "./LevelScheduleFormBody";
import useLevelScheduleForm from "../hooks/useLevelScheduleForm";
import { useState } from "react";
import { HStack } from "@chakra-ui/react";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import EditButton from "../../components/EditButton";

interface Props {
  campId?: number;
  levelSchedule: LevelSchedule;
  isReadOnly?: boolean;
}

const LevelScheduleForm = ({ campId, levelSchedule, isReadOnly }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const levelScheduleForm = useLevelScheduleForm(campId, levelSchedule);

  return (
    <>
      <LevelScheduleFormBody
        {...levelScheduleForm}
        level={levelSchedule.level}
        isReadOnly={!isEditing}
      />
      {!isReadOnly && (
        <HStack justifyContent="right" spacing={3} paddingTop={3}>
          <EditButton isEditing={isEditing} setIsEditing={setIsEditing} />
          <CancelButton
            onClick={() => {
              levelScheduleForm.handleClose();
              setIsEditing(false);
            }}
            disabled={!isEditing}
          >
            Cancel
          </CancelButton>
          <SubmitButton
            onClick={() => {
              levelScheduleForm.handleSubmit();
              if (levelScheduleForm.isValid) setIsEditing(false);
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

export default LevelScheduleForm;
