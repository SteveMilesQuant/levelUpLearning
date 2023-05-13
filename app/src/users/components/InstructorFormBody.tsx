import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { User } from "../User";

interface Props {
  instructor: User;
  isReadOnly?: boolean;
}

const InstructorFormBody = ({ instructor, isReadOnly }: Props) => {
  return (
    <Stack spacing={5}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          isReadOnly={true}
          value={instructor.full_name}
          onChange={() => {}}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Subjects</FormLabel>
        <Input
          type="text"
          isReadOnly={isReadOnly}
          value={instructor.instructor_subjects}
          onChange={() => {}}
        />
      </FormControl>
      <FormControl>
        <FormLabel>About</FormLabel>
        <Input
          as={Textarea}
          size="xl"
          height="250px"
          isReadOnly={isReadOnly}
          value={instructor.instructor_description}
          onChange={() => {}}
        />
      </FormControl>
    </Stack>
  );
};

export default InstructorFormBody;
