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

interface Props {
  camp: Camp;
}

const CampCard = ({ camp }: Props) => {
  return (
    <Card>
      <CardBody>
        <HStack alignItems="end">
          <Heading fontSize="2xl">{camp.program?.title}</Heading>
          <Text>{"with " + camp.primary_instructor?.full_name}</Text>
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
