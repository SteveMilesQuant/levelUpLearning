import {
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Radio,
    RadioGroup,
    Select,
    SimpleGrid,
    Stack,
} from "@chakra-ui/react";
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import InputError from "../../components/InputError";
import { FormData } from "../hooks/useStudentFormEntry";

const REFERRAL_OPTIONS = [
    "Facebook Group Post",
    "Facebook Ad",
    "Friend Recommended",
    "Google Ad",
    "Google Search",
    "Yard Sign",
    "Other",
];

interface Props {
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
    control: Control<FormData>;
    isReadOnly?: boolean;
}

const StudentFormEntryBody = ({
    register,
    errors,
    control,
    isReadOnly,
}: Props) => {
    return (
        <SimpleGrid columns={1} gap={5}>
            <FormControl>
                <FormLabel>Child's Current School *</FormLabel>
                <InputError
                    label={errors.child_school?.message}
                    isOpen={!!errors.child_school}
                >
                    <Input
                        {...register("child_school")}
                        type="text"
                        isReadOnly={isReadOnly}
                    />
                </InputError>
            </FormControl>

            <FormControl>
                <FormLabel>Parent Contact Name (First and Last) *</FormLabel>
                <InputError
                    label={errors.parent_name?.message}
                    isOpen={!!errors.parent_name}
                >
                    <Input
                        {...register("parent_name")}
                        type="text"
                        isReadOnly={isReadOnly}
                    />
                </InputError>
            </FormControl>

            <FormControl>
                <FormLabel>Preferred Parent Email</FormLabel>
                <Input
                    {...register("parent_email")}
                    type="email"
                    isReadOnly={isReadOnly}
                />
            </FormControl>

            <FormControl>
                <FormLabel>Parent Contact Phone Number *</FormLabel>
                <InputError
                    label={errors.parent_phone?.message}
                    isOpen={!!errors.parent_phone}
                >
                    <Input
                        {...register("parent_phone")}
                        type="tel"
                        isReadOnly={isReadOnly}
                    />
                </InputError>
            </FormControl>

            <FormControl>
                <FormLabel>
                    Emergency Contact (name and number) *
                </FormLabel>
                <InputError
                    label={errors.emergency_contact?.message}
                    isOpen={!!errors.emergency_contact}
                >
                    <Textarea
                        {...register("emergency_contact")}
                        isReadOnly={isReadOnly}
                    />
                </InputError>
            </FormControl>

            <FormControl>
                <FormLabel>Allergies or Other Health Concerns *</FormLabel>
                <InputError
                    label={errors.allergies?.message}
                    isOpen={!!errors.allergies}
                >
                    <Textarea {...register("allergies")} isReadOnly={isReadOnly} />
                </InputError>
            </FormControl>

            <FormControl>
                <FormLabel>
                    Authorized Pickup Persons (photo ID required) *
                </FormLabel>
                <InputError
                    label={errors.pickup_persons?.message}
                    isOpen={!!errors.pickup_persons}
                >
                    <Textarea
                        {...register("pickup_persons")}
                        isReadOnly={isReadOnly}
                    />
                </InputError>
            </FormControl>

            <FormControl>
                <FormLabel>
                    Anything else important for us to know about your child?
                </FormLabel>
                <Textarea
                    {...register("additional_info")}
                    isReadOnly={isReadOnly}
                />
            </FormControl>

            <FormControl>
                <FormLabel>
                    Photo Permission for Advertising Purposes *
                </FormLabel>
                <InputError
                    label={errors.photo_permission?.message}
                    isOpen={!!errors.photo_permission}
                >
                    <Controller
                        name="photo_permission"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                onChange={(val) => field.onChange(val === "true")}
                                value={
                                    field.value === true
                                        ? "true"
                                        : field.value === false
                                            ? "false"
                                            : ""
                                }
                                isDisabled={isReadOnly}
                            >
                                <Stack direction="row" spacing={5}>
                                    <Radio value="true">Yes, I give my permission</Radio>
                                    <Radio value="false">No, do not use my child's pictures</Radio>
                                </Stack>
                            </RadioGroup>
                        )}
                    />
                </InputError>
            </FormControl>

            <FormControl>
                <FormLabel>Where did you hear about us?</FormLabel>
                <Select
                    {...register("referral_source")}
                    disabled={isReadOnly}
                    _disabled={{ opacity: 1 }}
                >
                    <option value="">Select one</option>
                    {REFERRAL_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
            </FormControl>
        </SimpleGrid>
    );
};

export default StudentFormEntryBody;
