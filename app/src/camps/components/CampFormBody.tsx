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
import { Camp } from "../services/camp-service";
import InputError from "../../components/InputError";
import { Program } from "../../programs/services/program-service";
import { User } from "../../services/user-service";

interface Props {
  selectedProgram?: Program;
  setSelectedProgram: (program?: Program) => void;
  selectedInstructor?: User;
  setSelectedInstructor: (user?: User) => void;
  isReadOnly?: boolean;
}

const CampFormBody = ({
  selectedProgram,
  setSelectedProgram,
  selectedInstructor,
  setSelectedInstructor,
  isReadOnly,
}: Props) => {
  return (
    <Grid
      templateAreas={{
        base: `"Program" "Instructor"`,
      }}
      gap={5}
    >
      <GridItem area="Program">
        <FormControl>
          <FormLabel>Program</FormLabel>
        </FormControl>
      </GridItem>
      <GridItem area="Instructor">
        <FormControl>
          <FormLabel>Instructor</FormLabel>
        </FormControl>
      </GridItem>
    </Grid>
  );
};

export default CampFormBody;