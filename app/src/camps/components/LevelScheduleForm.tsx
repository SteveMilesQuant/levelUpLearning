import { LevelSchedule } from "../LevelSchedule";
import LevelScheduleFormBody from "./LevelScheduleFormBody";
import useLevelScheduleForm from "../hooks/useLevelScheduleForm";
import { useState } from "react";
import { HStack } from "@chakra-ui/react";
import ActionButton from "../../components/ActionButton";
import { AiFillEdit } from "react-icons/ai";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";

interface Props {
  campId?: number;
  levelSchedule: LevelSchedule;
  isReadOnly?: boolean;
}

const LevelScheduleForm = ({ campId, levelSchedule, isReadOnly }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const levelScheduleForm = useLevelScheduleForm({ levelSchedule });

  return (
    <>
      <LevelScheduleFormBody
        {...levelScheduleForm}
        level={levelSchedule.level}
        isReadOnly={!isEditing}
      />
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
              if (levelScheduleForm.isValid) {
                levelScheduleForm.handleClose();
                setIsEditing(false);
              }
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
