import {
  Card,
  CardBody,
  Divider,
  HStack,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Camp } from "../Camp";
import DeleteButton from "../../components/DeleteButton";
import useLevelSchedules from "../hooks/useLevelSchedules";
import { locale } from "../../constants";

interface Props {
  camp: Camp;
  onDelete?: () => void;
}

const CampCard = ({ camp, onDelete }: Props) => {
  const byLine = "with " + camp.primary_instructor.full_name;
  const { data: levelSchedules, error, isLoading } = useLevelSchedules(camp.id);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <LinkBox
      as={Card}
      _hover={{
        bgColor: "gray.200",
      }}
    >
      <CardBody>
        <HStack justifyContent="space-between">
          <LinkOverlay as={RouterLink} to={"/camps/" + camp.id}>
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
            <strong>Tags: </strong>
            {camp.program.tags}
          </Text>
          <Text>
            <strong>Grades: </strong>
            {camp.program.grade_range[0] + " to " + camp.program.grade_range[1]}
          </Text>
          <Text>
            <strong>Start time: </strong>
            {levelSchedules.length > 0 &&
              levelSchedules[0].start_time.toLocaleDateString(locale, {
                dateStyle: "short",
              }) +
                " @ " +
                levelSchedules[0].start_time.toLocaleTimeString(locale, {
                  timeStyle: "short",
                })}
          </Text>
        </HStack>
      </CardBody>
    </LinkBox>
  );
};

export default CampCard;
