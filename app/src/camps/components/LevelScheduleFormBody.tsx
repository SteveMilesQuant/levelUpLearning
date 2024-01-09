import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
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
  isPublicFacing?: boolean;
  isReadOnly?: boolean;
}

const LevelScheduleFormBody = ({
  level,
  register,
  errors,
  isPublicFacing,
  isReadOnly,
}: Props) => {
  return (
    <Stack spacing={5}>
      {!isPublicFacing && (
        <>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input type="text" isReadOnly={true} value={level.title} />
          </FormControl>
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
        </>
      )}
      <FormControl>
        {!isPublicFacing && <FormLabel>Description</FormLabel>}
        <Input
          as={Textarea}
          size="xl"
          height="15rem"
          isReadOnly={true}
          value={level.description}
        />
      </FormControl>
    </Stack>
  );
};

export default LevelScheduleFormBody;
