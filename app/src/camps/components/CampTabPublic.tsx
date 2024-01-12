import { Stack, Text, Textarea } from "@chakra-ui/react";
import { Camp } from "../Camp";

interface Props {
  camp?: Camp;
}

const CampTabPublic = ({ camp }: Props) => {
  if (!camp) return null;
  return (
    <Stack spacing={5}>
      <Text>Grade range: {camp.program.grade_range.join(" to ")}</Text>
      <Textarea
        size="xl"
        height="15rem"
        isReadOnly={true}
        value={camp.program.description}
        padding={3}
      />
    </Stack>
  );
};

export default CampTabPublic;
