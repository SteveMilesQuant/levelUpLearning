import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useLevelSchedules from "../hooks/useLevelSchedules";
import { LevelSchedule } from "../LevelSchedule";
import LevelScheduleForm from "./LevelScheduleForm";
import { FaChevronDown } from "react-icons/fa";

interface Props {
  campId: number;
  isPublicFacing?: boolean;
  isReadOnly?: boolean;
}

const LevelScheduleList = ({ campId, isPublicFacing, isReadOnly }: Props) => {
  const { data: levelSchedules, isLoading, error } = useLevelSchedules(campId);

  const [selectedLevelSched, setSelectedLevelSched] = useState<
    LevelSchedule | undefined
  >(undefined);
  useEffect(() => {
    if (levelSchedules) setSelectedLevelSched(levelSchedules[0]);
  }, [!!levelSchedules]);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <Stack spacing={5}>
      <Menu autoSelect={true}>
        <MenuButton as={Button} rightIcon={<FaChevronDown />}>
          {selectedLevelSched?.level?.list_index +
            ": " +
            selectedLevelSched?.level?.title}
        </MenuButton>
        <MenuList>
          {levelSchedules?.map((levelSchedule) => (
            <MenuItem
              key={levelSchedule.level.id}
              onClick={() => setSelectedLevelSched(levelSchedule)}
            >
              {levelSchedule.level?.list_index +
                ": " +
                levelSchedule.level?.title}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Box width="100%">
        {levelSchedules
          ?.filter(
            (levelSchedule) =>
              levelSchedule.level.id === selectedLevelSched?.level.id
          )
          .map((levelSchedule) => (
            <LevelScheduleForm
              key={levelSchedule.level.id}
              campId={campId}
              levelSchedule={levelSchedule}
              isPublicFacing={isPublicFacing}
              isReadOnly={isReadOnly}
            ></LevelScheduleForm>
          ))}
      </Box>
    </Stack>
  );
};

export default LevelScheduleList;
