import {
  Box,
  Card,
  CardBody,
  Divider,
  HStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Camp } from "../services/camp-service";
import DeleteButton from "../../components/DeleteButton";

interface Props {
  camp: Camp;
  onDelete?: () => void;
}

const CampCard = ({ camp, onDelete }: Props) => {
  const byLine = "with " + camp.primary_instructor?.full_name;

  return (
    <Card>
      <CardBody>
        <HStack justifyContent="space-between">
          <HStack alignItems="end">
            <Heading fontSize="2xl">{camp.program?.title}</Heading>
            <Text>{byLine}</Text>
          </HStack>
          {onDelete && (
            <DeleteButton onConfirm={onDelete}>
              {camp.program?.title + " " + byLine}
            </DeleteButton>
          )}
        </HStack>
        <Divider orientation="horizontal" marginTop={2} />
        <HStack marginTop={2} justifyContent="space-between">
          <Text>
            <strong>Tags: </strong>
            {camp.program?.tags}
          </Text>
          <Text>
            <strong>Grades: </strong>
            {camp.program?.grade_range[0] +
              " to " +
              camp.program?.grade_range[1]}
          </Text>
          <Text>
            <strong>Start time: </strong>
          </Text>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default CampCard;
