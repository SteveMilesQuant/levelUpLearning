import { List, ListItem } from "@chakra-ui/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import ListButton from "../../components/ListButton";
import { Level } from "../Level";
import useLevels, { useUpdateLevel } from "../hooks/useLevels";
import { ReactNode } from "react";

interface Props {
  programId: number;
  children: ReactNode; // added at the bottom of the list (e.g. "Add level" button)
  selectedLevel?: Level;
  setSelectedLevel: (level: Level) => void;
}

const LevelList = ({
  programId,
  children,
  selectedLevel,
  setSelectedLevel,
}: Props) => {
  const { data: levels, error, isLoading } = useLevels(programId);
  const updateLevel = useUpdateLevel(programId);

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
                        {level.title}
                      </ListButton>
                    </ListItem>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
            {children}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default LevelList;
