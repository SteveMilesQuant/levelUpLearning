import {
  FormControl,
  FormLabel,
  Input,
  LinkOverlay,
  Select,
  Stack,
  Grid,
  GridItem,
  Box,
  Checkbox,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { FormData } from "../hooks/useCampForm";
import InputError from "../../components/InputError";
import { usePrograms } from "../../programs";
import { useUsers } from "../../users";
import { Camp } from "../Camp";
import DatePicker from "react-datepicker";
import { Fragment } from "react";
import { AiFillDelete } from "react-icons/ai";
import ActionButton from "../../components/ActionButton";
import { FaRegCalendarPlus } from "react-icons/fa";

interface Props {
  camp?: Camp;
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  isReadOnly?: boolean;
  showPrimaryInstructor?: boolean;
}

const CampFormBody = ({
  camp,
  register,
  control,
  errors,
  isReadOnly,
  showPrimaryInstructor,
}: Props) => {
  const { data: programs } = usePrograms();
  const { data: instructors } = useUsers({ role: "INSTRUCTOR" });

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
                bgColor: "brand.hover",
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
        <FormLabel>Camp type</FormLabel>
        <InputError
          label={errors.location?.message}
          isOpen={errors.location ? true : false}
        >
          <Input
            {...register("camp_type")}
            type="text"
            isReadOnly={isReadOnly}
          />
        </InputError>
      </FormControl>
      <FormControl>
        <FormLabel>Location</FormLabel>
        <InputError
          label={errors.location?.message}
          isOpen={errors.location ? true : false}
        >
          <Input
            {...register("location")}
            type="text"
            isReadOnly={isReadOnly}
          />
        </InputError>
      </FormControl>
      <FormControl>
        <FormLabel>Dates</FormLabel>
        <Controller
          control={control}
          name="z_dates"
          render={({ field }) => (
            <Grid templateColumns="repeat(3, 1fr)" paddingX={3}>
              {field.value?.map((date, index) => (
                <Fragment key={index}>
                  <GridItem colSpan={2} marginY="auto">
                    <DatePicker
                      selected={date}
                      onChange={(d) =>
                        field.onChange([
                          ...field.value.slice(0, index),
                          d,
                          ...field.value.slice(index + 1),
                        ])
                      }
                      readOnly={isReadOnly}
                    />
                  </GridItem>
                  <GridItem marginY="auto">
                    <ActionButton
                      Component={AiFillDelete}
                      label="Delete"
                      disabled={isReadOnly}
                      onClick={() => {
                        field.onChange([
                          ...field.value.slice(0, index),
                          ...field.value.slice(index + 1),
                        ]);
                      }}
                    />
                  </GridItem>
                </Fragment>
              ))}
              <GridItem marginY="auto">
                <ActionButton
                  Component={FaRegCalendarPlus}
                  label="Add date"
                  disabled={isReadOnly}
                  onClick={() => {
                    const lastDate = field.value
                      ? field.value[field.value.length - 1]
                      : undefined;
                    const newDate = lastDate
                      ? new Date(lastDate.getTime())
                      : new Date();
                    newDate.setDate(newDate.getDate() + 1);
                    const origArray = field.value ? [...field.value] : [];
                    field.onChange([...origArray, newDate]);
                  }}
                />
              </GridItem>
            </Grid>
          )}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Daily start time</FormLabel>
        <Box paddingX={3}>
          <Controller
            control={control}
            name="z_daily_start_time"
            render={({ field }) => (
              <DatePicker
                placeholderText="Select date"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                readOnly={isReadOnly}
              />
            )}
          />
        </Box>
      </FormControl>
      <FormControl>
        <FormLabel>Daily end time</FormLabel>
        <Box paddingX={3}>
          <Controller
            control={control}
            name="z_daily_end_time"
            render={({ field }) => (
              <DatePicker
                placeholderText="Select date"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                readOnly={isReadOnly}
              />
            )}
          />
        </Box>
      </FormControl>
      <FormControl>
        <FormLabel>Cost</FormLabel>
        <InputError
          label={errors.cost?.message}
          isOpen={errors.cost ? true : false}
        >
          <Input {...register("cost")} type="number" isReadOnly={isReadOnly} />
        </InputError>
      </FormControl>
      <FormControl>
        <FormLabel>Disable enrollment</FormLabel>
        <InputError
          label={errors.enrollment_disabled?.message}
          isOpen={errors.enrollment_disabled ? true : false}
        >
          <Checkbox disabled={isReadOnly} {...register("enrollment_disabled")}>Enrollment disabled</Checkbox>
        </InputError>
      </FormControl>
    </Stack>
  );
};

export default CampFormBody;
