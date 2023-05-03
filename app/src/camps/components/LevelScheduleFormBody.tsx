import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Level } from "../../programs";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "../hooks/useLevelScheduleForm";
import InputError from "../../components/InputError";

interface Props {
  level: Level;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isReadOnly?: boolean;
}

const LevelScheduleFormBody = ({
  level,
  register,
  errors,
  isReadOnly,
}: Props) => {
  return (
    <Grid
      templateAreas={{
        base: `"title" "time" "desc"`,
      }}
      gap={5}
    >
      <GridItem area="title">
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input type="text" isReadOnly={true} value={level.title} />
        </FormControl>
      </GridItem>

      <GridItem area="time">
        <HStack spacing={3}>
          <FormControl>
            <FormLabel>Start time: </FormLabel>
            <InputError
              label={errors.start_time?.message}
              isOpen={errors.start_time ? true : false}
            >
              <Input
                {...register("start_time")}
                type="datetime-local"
                isReadOnly={isReadOnly}
              />
            </InputError>
          </FormControl>
          <FormControl>
            <FormLabel>End time: </FormLabel>
            <InputError
              label={errors.end_time?.message}
              isOpen={errors.end_time ? true : false}
            >
              <Input
                {...register("end_time")}
                type="datetime-local"
                isReadOnly={isReadOnly}
              />
            </InputError>
          </FormControl>
        </HStack>
      </GridItem>

      <GridItem area="desc">
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            as={Textarea}
            size="xl"
            height="210px"
            isReadOnly={true}
            value={level.description}
          />
        </FormControl>
      </GridItem>
    </Grid>
  );
};

export default LevelScheduleFormBody;
