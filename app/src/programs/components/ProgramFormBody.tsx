import {
  FormControl,
  FormLabel,
  HStack,
  Input,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "../hooks/useProgramForm";
import InputError from "../../components/InputError";

interface Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  selectedGradeRange: number[];
  setSelectedGradeRange: (value: number[]) => void;
  isPublicFacing?: boolean;
  isEditing?: boolean;
}

const ProgramFormBody = ({
  register,
  errors,
  selectedGradeRange,
  setSelectedGradeRange,
  isPublicFacing,
  isEditing,
}: Props) => {
  return (
    <Stack spacing={5}>
      <FormControl>
        {!isPublicFacing && <FormLabel>Title</FormLabel>}
        <InputError
          label={errors.title?.message}
          isOpen={errors.title ? true : false}
        >
          <Input {...register("title")} type="text" isReadOnly={!isEditing} />
        </InputError>
      </FormControl>
      <HStack justifyContent="space-between" spacing={10}>
        {!isPublicFacing && (
          <FormControl>
            <FormLabel>Tags</FormLabel>
            <InputError
              label={errors.tags?.message}
              isOpen={errors.tags ? true : false}
            >
              <Input
                {...register("tags")}
                type="text"
                isReadOnly={!isEditing}
              />
            </InputError>
          </FormControl>
        )}
        <FormControl>
          <FormLabel>Grade range: {selectedGradeRange.join(" to ")}</FormLabel>
          {!isPublicFacing && (
            <RangeSlider
              onChange={(value: number[]) => setSelectedGradeRange(value)}
              aria-label={["min", "max"]}
              value={selectedGradeRange}
              min={1}
              max={12}
              step={1}
              isReadOnly={!isEditing}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
          )}
        </FormControl>
      </HStack>
      <FormControl>
        {!isPublicFacing && <FormLabel>Description</FormLabel>}
        <InputError
          label={errors.description?.message}
          isOpen={errors.description ? true : false}
        >
          <Input
            {...register("description")}
            as={Textarea}
            size="xl"
            height="15rem"
            isReadOnly={!isEditing}
          />
        </InputError>
      </FormControl>
    </Stack>
  );
};

export default ProgramFormBody;
