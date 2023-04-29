import { HStack } from "@chakra-ui/react";
import useLevelForm from "../hooks/useLevelForm";
import LevelFormBody from "./LevelFormBody";
import levelService from "../level-service";
import { Level } from "../Level";
import ActionButton from "../../components/ActionButton";
import DeleteButton from "../../components/DeleteButton";
import { AiFillEdit } from "react-icons/ai";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import { Program } from "../Program";
import { useState } from "react";

interface Props {
  program?: Program;
  level?: Level;
  levels?: Level[];
  setLevels?: (level: Level[]) => void;
}

const LevelForm = ({ program, level, levels, setLevels }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const levelForm = useLevelForm({ program, level, levels, setLevels });

  const handleDeleteLevel = () => {
    if (!program || !level || !setLevels) return;
    const origLevels = levels ? [...levels] : [];
    setLevels(origLevels.filter((l) => l.id !== level.id));
    levelService(program?.id)
      .delete(level.id)
      .catch((err) => {
        console.log(err);
        setLevels(origLevels);
      });
  };

  return (
    <>
      <LevelFormBody {...levelForm} isReadOnly={!isEditing} />
      {setLevels && (
        <HStack justifyContent="right" spacing={3} paddingTop={3}>
          <ActionButton
            Component={AiFillEdit}
            label="Edit"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
          />
          <DeleteButton onConfirm={handleDeleteLevel} disabled={isEditing}>
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
