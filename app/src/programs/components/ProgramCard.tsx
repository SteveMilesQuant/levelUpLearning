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
import { Program } from "../Program";
import DeleteButton from "../../components/DeleteButton";

interface Props {
  program: Program;
  onDelete?: () => void;
}

const ProgramCard = ({ program, onDelete }: Props) => {
  return (
    <LinkBox
      as={Card}
      _hover={{
        bgColor: "gray.200",
      }}
    >
      <CardBody>
        <HStack justifyContent="space-between">
          <LinkOverlay as={RouterLink} to={"/programs/" + program.id}>
            <Heading fontSize="2xl">{program.title}</Heading>
          </LinkOverlay>
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
    </LinkBox>
  );
};

export default ProgramCard;
