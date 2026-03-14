import {
    Alert,
    AlertIcon,
    Box,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Radio,
    RadioGroup,
    Select,
    SimpleGrid,
    Stack,
    Text,
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

const GRADE_OPTIONS = Array.from(Array(12).keys()).map((x) => x + 1);

interface Props {
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>;
    control: Control<FormData>;
    isReadOnly?: boolean;
    page?: number;
    studentGrade?: number;
    onGradeChange?: (grade: number) => void;
}

export const FORM_PAGE_TITLES = [
    "Confirm Grade Level",
    "Contact Information",
    "Safety & Health",
    "Additional Information",
];

export const FORM_TOTAL_PAGES = FORM_PAGE_TITLES.length;

export const FIELD_TO_PAGE: Record<string, number> = {
    child_school: 1,
    parent_name: 1,
    parent_email: 1,
    parent_phone: 1,
    emergency_contact: 2,
    allergies: 2,
    pickup_persons: 2,
    additional_info: 3,
    photo_permission: 3,
    referral_source: 3,
};

const StudentFormEntryBody = ({
    register,
    errors,
    control,
    isReadOnly,
    page,
    studentGrade,
    onGradeChange,
}: Props) => {
    const showAll = page === undefined;

    return (
        <SimpleGrid columns={1} gap={5}>
            {(showAll || page === 0) && <>
                <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Text fontSize="sm">
                        Please confirm your child's grade level for the <strong>coming
                            school year</strong> (after this summer). If your child was in 3rd
                        grade this past year, they would now be entering 4th grade.
                    </Text>
                </Alert>

                <FormControl>
                    <FormLabel>Grade Level for Upcoming School Year *</FormLabel>
                    <Select
                        value={studentGrade ?? ""}
                        onChange={(e) => onGradeChange?.(parseInt(e.target.value))}
                        isDisabled={isReadOnly}
                        _disabled={{ opacity: 1 }}
                    >
                        <option value="" disabled>Select grade</option>
                        {GRADE_OPTIONS.map((grade) => (
                            <option key={grade} value={grade}>
                                {grade}
                            </option>
                        ))}
                    </Select>
                </FormControl>
            </>
            }

            {(showAll || page === 1) && <>
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
            </>}

            {(showAll || page === 2) && <>
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
            </>}

            {(showAll || page === 3) && <>
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
                        <Box>
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
                        </Box>
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
            </>}
        </SimpleGrid>
    );
};

export default StudentFormEntryBody;
