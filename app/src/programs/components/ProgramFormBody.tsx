import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Textarea,
} from "@chakra-ui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Program } from "../services/program-service";
import { FormData } from "../hooks/useProgramForm";
import InputError from "../../components/InputError";

interface Props {
  program?: Program;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  selectedGradeRange: number[];
  setSelectedGradeRange: (value: number[]) => void;
  isReadOnly?: boolean;
}

const ProgramFormBody = ({
  program,
  register,
  errors,
  selectedGradeRange,
  setSelectedGradeRange,
  isReadOnly,
}: Props) => {
  return (
    <Grid
      templateAreas={{
        base: `"title desc" "tags desc" "gradeRange desc"`,
      }}
      gap={5}
    >
      <GridItem area="title">
        <FormControl>
          <FormLabel>Title</FormLabel>
          <InputError
            label={errors.title?.message}
            isOpen={errors.title ? true : false}
          >
            <Input {...register("title")} type="text" isReadOnly={isReadOnly} />
          </InputError>
        </FormControl>
      </GridItem>
      <GridItem area="tags">
        <FormControl>
          <FormLabel>Tags</FormLabel>
          <InputError
            label={errors.tags?.message}
            isOpen={errors.tags ? true : false}
          >
            <Input {...register("tags")} type="text" isReadOnly={isReadOnly} />
          </InputError>
        </FormControl>
      </GridItem>
      <GridItem area="gradeRange">
        <FormControl>
          <FormLabel>Grade range: {selectedGradeRange.join(" to ")}</FormLabel>
          <RangeSlider
            onChange={(value: number[]) => setSelectedGradeRange(value)}
            aria-label={["min", "max"]}
            defaultValue={[
              program?.grade_range[0] || 6,
              program?.grade_range[1] || 8,
            ]}
            min={1}
            max={12}
            step={1}
            isReadOnly={isReadOnly}
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
        </FormControl>
      </GridItem>
      <GridItem area="desc">
        <FormControl>
          <FormLabel>Description</FormLabel>
          <InputError
            label={errors.description?.message}
            isOpen={errors.description ? true : false}
          >
            <Input
              {...register("description")}
              as={Textarea}
              size="xl"
              height="210px"
              isReadOnly={isReadOnly}
            />
          </InputError>
        </FormControl>
      </GridItem>
    </Grid>
  );
};

export default ProgramFormBody;
