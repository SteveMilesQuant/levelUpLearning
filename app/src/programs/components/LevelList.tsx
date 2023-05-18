import {
  Box,
  Button,
  HStack,
  List,
  ListItem,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Level } from "../Level";
import useLevels, { useUpdateLevel } from "../hooks/useLevels";
import ListButton from "../../components/ListButton";
import LevelForm from "./LevelForm";
import LevelFormModal from "./LevelFormModal";

interface Props {
  programId: number;
}

const LevelList = ({ programId }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(
    undefined
  );
  const { data: levels, error, isLoading } = useLevels(programId);
  const updateLevel = useUpdateLevel(programId);

  useEffect(() => {
    if (levels) setSelectedLevel(levels[0]);
  }, [!!levels]);

  if (isLoading) return null;
  if (error) throw error;

  const handleDragEnd = (result: DropResult) => {
    const origLevel = levels.find(
      (level) => level.id.toString() === result.draggableId
    );
    if (!origLevel || !result.destination) return;
    const newLevel = {
      ...origLevel,
      list_index: result.destination.index,
    } as Level;
    updateLevel.mutate(newLevel);
  };

  return (
    <>
      <HStack alignItems="start" spacing={10}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="levels">
            {(provided) => (
              <List
                spacing={3}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {levels
                  .sort((a, b) => a.list_index - b.list_index)
                  .map((level) => (
                    <Draggable
                      key={level.id.toString()}
                      draggableId={level.id.toString()}
                      index={level.list_index}
                    >
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ListButton
                            isSelected={selectedLevel?.id === level.id}
                            onClick={() => setSelectedLevel(level)}
                            hoverCursor="grab"
                          >
                            {level.list_index + ": " + level.title}
                          </ListButton>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
                <Button onClick={onOpen}>Add level</Button>
              </List>
            )}
          </Droppable>
        </DragDropContext>
        <Box width="100%">
          {levels
            ?.filter((level) => level.id === selectedLevel?.id)
            .map((level) => (
              <LevelForm
                key={level.id}
                programId={programId}
                level={level}
                isReadOnly={false}
              ></LevelForm>
            ))}
        </Box>
      </HStack>
      <LevelFormModal
        title="Add level"
        isOpen={isOpen}
        onClose={onClose}
        programId={programId}
      ></LevelFormModal>
    </>
  );
};

export default LevelList;
