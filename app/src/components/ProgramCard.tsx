import {
  Card,
  CardBody,
  Divider,
  HStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Program } from "../services/program-service";
import DeleteButton from "./DeleteButton";

interface Props {
  program: Program;
  onDelete?: () => void;
}

const ProgramCard = ({ program, onDelete }: Props) => {
  return (
    <Card>
      <CardBody>
        <HStack justifyContent="space-between">
          <Heading fontSize="2xl">{program.title}</Heading>
          {onDelete && (
            <DeleteButton onConfirm={onDelete}>{program.title}</DeleteButton>
          )}
        </HStack>
        <Divider orientation="horizontal" marginTop={2} />
        <HStack justifyContent="space-between" marginTop={2}>
          <Text>
            <strong>Tags: </strong>
            {program?.tags}
          </Text>
          <Text>
            <strong>Grades: </strong>
            {program?.grade_range[0] + " to " + program?.grade_range[1]}
          </Text>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default ProgramCard;
