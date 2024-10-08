import { Divider, HStack, Heading, LinkOverlay, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Program } from "../Program";
import DeleteButton from "../../components/DeleteButton";
import { useDeleteProgram } from "../hooks/usePrograms";
import CardContainer from "../../components/CardContainer";

interface Props {
  program: Program;
}

const ProgramCard = ({ program }: Props) => {
  const deleteProgram = useDeleteProgram();

  return (
    <CardContainer>
      <HStack justifyContent="space-between">
        <LinkOverlay as={RouterLink} to={"/programs/" + program.id}>
          <Heading fontSize="2xl">{program.title}</Heading>
        </LinkOverlay>
        <DeleteButton onConfirm={() => deleteProgram.mutate(program.id)}>
          {program.title}
        </DeleteButton>
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
    </CardContainer>
  );
};

export default ProgramCard;
