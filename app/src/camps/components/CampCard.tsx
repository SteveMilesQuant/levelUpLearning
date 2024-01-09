import { Divider, HStack, Heading, LinkOverlay, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Camp } from "../Camp";
import DeleteButton from "../../components/DeleteButton";
import useLevelSchedules from "../hooks/useLevelSchedules";
import { locale } from "../../constants";
import { useContext } from "react";
import CampsContext, { CampsContextType } from "../campsContext";
import CardContainer from "../../components/CardContainer";
import { useCampInstructors } from "../../users";

interface Props {
  camp: Camp;
  onDelete?: () => void;
}

const CampCard = ({ camp, onDelete }: Props) => {
  const campsContextType = useContext(CampsContext);
  const {
    data: levelSchedules,
    error: levelsError,
    isLoading: levelsAreLoading,
  } = useLevelSchedules(camp.id);
  const {
    data: instructors,
    error: instructorsError,
    isLoading: instructorsAreLoading,
  } = useCampInstructors(camp.id);

  if (levelsAreLoading || instructorsAreLoading) return null;
  if (levelsError) throw levelsError;
  if (instructorsError) throw instructorsError;

  const byLine =
    "with " +
    instructors
      ?.map((instructor, index) => {
        if (index === 0) return instructor.full_name;
        if (index === instructors.length - 1) {
          if (instructors.length > 2) return ", and " + instructor.full_name;
          return " and " + instructor.full_name;
        }
        return ", " + instructor.full_name;
      })
      .join("");
  const startDate =
    levelSchedules && levelSchedules[0]?.start_time
      ? new Date(levelSchedules[0]?.start_time)
      : undefined;
  const linkTarget =
    campsContextType === CampsContextType.schedule
      ? "/schedule/" + camp.id
      : campsContextType === CampsContextType.teach
      ? "/teach/" + camp.id
      : "/camps/" + camp.id;

  return (
    <CardContainer>
      <HStack justifyContent="space-between">
        <LinkOverlay as={RouterLink} to={linkTarget}>
          <HStack alignItems="end">
            <Heading fontSize="2xl">{camp.program.title}</Heading>
            <Text>{byLine}</Text>
          </HStack>
        </LinkOverlay>
        {onDelete && (
          <DeleteButton onConfirm={onDelete}>
            {camp.program.title + " " + byLine}
          </DeleteButton>
        )}
      </HStack>

      <Divider orientation="horizontal" marginTop={2} />
      <HStack marginTop={2} justifyContent="space-between">
        <Text>
          <strong>Grades: </strong>
          {camp.program.grade_range[0] + " to " + camp.program.grade_range[1]}
        </Text>
        <Text>
          <strong>Start time: </strong>
          {startDate &&
            startDate.toLocaleDateString(locale, {
              dateStyle: "short",
            }) +
              " @ " +
              startDate.toLocaleTimeString(locale, {
                timeStyle: "short",
              })}
        </Text>
      </HStack>
    </CardContainer>
  );
};

export default CampCard;
