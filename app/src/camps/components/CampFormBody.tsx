import {
  FormControl,
  FormLabel,
  Input,
  LinkOverlay,
  Text,
  Select,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "../hooks/useCampForm";
import InputError from "../../components/InputError";
import { usePrograms } from "../../programs";
import { useUsers } from "../../users";
import { Camp } from "../Camp";
import { locale } from "../../constants";
import { Fragment } from "react";

interface Props {
  camp?: Camp;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isReadOnly?: boolean;
  showPrimaryInstructor?: boolean;
}

const CampFormBody = ({
  camp,
  register,
  errors,
  isReadOnly,
  showPrimaryInstructor,
}: Props) => {
  const { data: programs } = usePrograms();
  const { data: instructors } = useUsers({ role: "INSTRUCTOR" });

  const today = new Date();

  return (
    <Stack spacing={5}>
      <FormControl>
        <FormLabel>Program</FormLabel>
        {isReadOnly && (
          <LinkOverlay as={RouterLink} to={"/programs/" + camp?.program_id}>
            <Input
              value={camp?.program.title}
              type="text"
              isReadOnly={true}
              _hover={{
                bgColor: "gray.200",
                transform: "scale(1.03)",
                transition: "transform .2s ease-in",
              }}
              cursor="pointer"
            />
          </LinkOverlay>
        )}
        {!isReadOnly && (
          <InputError
            label={errors.program_id?.message}
            isOpen={errors.program_id ? true : false}
          >
            <Select {...register("program_id")}>
              <option value="">Select program</option>{" "}
              {programs?.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </Select>
          </InputError>
        )}
      </FormControl>
      {showPrimaryInstructor && (
        <FormControl>
          <FormLabel>Instructor</FormLabel>
          <InputError
            label={errors.primary_instructor_id?.message}
            isOpen={errors.primary_instructor_id ? true : false}
          >
            <Select
              {...register("primary_instructor_id")}
              isReadOnly={isReadOnly}
            >
              <option value="">Select primary instructor</option>
              {instructors?.map((instructor) => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.full_name + " (" + instructor.email_address + ")"}
                </option>
              ))}
            </Select>
          </InputError>
        </FormControl>
      )}
      <FormControl>
        <FormLabel>Dates</FormLabel>
        <SimpleGrid columns={1}>
          {camp?.dates?.map((dateStr: string) => {
            const date = new Date(dateStr + "T00:00:00");
            return (
              <Fragment key={dateStr}>
                <Text>
                  {date.toLocaleDateString(locale, {
                    dateStyle: "short",
                  })}
                </Text>
              </Fragment>
            );
          })}
        </SimpleGrid>
      </FormControl>
      <FormControl>
        <FormLabel>Daily start time</FormLabel>
        <Text>{camp?.daily_start_time}</Text>
      </FormControl>
      <FormControl>
        <FormLabel>Daily end time</FormLabel>
        <Text>{camp?.daily_end_time}</Text>
      </FormControl>
    </Stack>
  );
};

export default CampFormBody;
