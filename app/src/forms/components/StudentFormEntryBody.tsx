import {
    Alert,
    AlertIcon,
    Box,
    Checkbox,
    FormControl,
    FormLabel,
    Input,
    Link,
    Textarea,
    Radio,
    RadioGroup,
    Select,
    SimpleGrid,
    Stack,
    Text,
    FormHelperText,
} from "@chakra-ui/react";
import { Control, Controller, FieldErrors, UseFormRegister, useWatch } from "react-hook-form";
import InputError from "../../components/InputError";
import { FormData } from "../hooks/useStudentFormEntry";
import { formatPhone } from "../../utils/phone";

const REFERRAL_OPTIONS = [
    "Facebook Group Post",
    "Facebook Ad",
    "Friend Recommended",
    "Google Ad",
    "Google Search",
    "Yard Sign",
    "Local Event",
    "Instagram",
    "Nextdoor",
    "Fun 4 Raleigh Kids",
    "Other...",
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
    has_allergies: 2,
    allergies: 2,
    additional_info: 3,
    photo_permission: 3,
    referral_source: 3,
    terms_acknowledged: 3,
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
    const hasAllergies = useWatch({ control, name: "has_allergies" });

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
                    <FormLabel>Parent Preferred Email</FormLabel>
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
                        <Controller
                            name="parent_phone"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    onChange={(e) => field.onChange(formatPhone(e.target.value))}
                                    type="tel"
                                    isReadOnly={isReadOnly}
                                />
                            )}
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
                    <FormLabel>Does your child have allergies or other health concerns? *</FormLabel>
                    <InputError
                        label={errors.has_allergies?.message}
                        isOpen={!!errors.has_allergies}
                    >
                        <Box>
                            <Controller
                                name="has_allergies"
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
                                            <Radio value="true">Yes</Radio>
                                            <Radio value="false">No</Radio>
                                        </Stack>
                                    </RadioGroup>
                                )}
                            />
                        </Box>
                    </InputError>
                </FormControl>

                {(hasAllergies || isReadOnly) && <FormControl>
                    <FormLabel>Please describe the allergies or health concerns *</FormLabel>
                    <InputError
                        label={errors.allergies?.message}
                        isOpen={!!errors.allergies}
                    >
                        <Textarea {...register("allergies")} isReadOnly={isReadOnly} />
                    </InputError>
                </FormControl>}
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
                        Photo Permission for Promotional Purposes *
                    </FormLabel>
                    <FormHelperText mt={-2} mb={2} color="brand.text">
                        As a small business, we share some camp moments to show other families the fun and engaging experiences we offer. Do you give permission for us to use photos of your child for promotional purposes?
                    </FormHelperText>
                    <InputError
                        label={errors.photo_permission?.message}
                        isOpen={!!errors.photo_permission}
                    >
                        <Box marginY={2}>
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
                                        <Stack direction="column" spacing={2}>
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

                <FormControl>
                    <InputError
                        label={errors.terms_acknowledged?.message}
                        isOpen={!!errors.terms_acknowledged}
                    >
                        <Box>
                            <Controller
                                name="terms_acknowledged"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        isChecked={!!field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        isDisabled={isReadOnly}
                                        alignItems="flex-start"
                                        spacing={3}
                                    >
                                        <Text fontSize="sm">
                                            By checking this box, I acknowledge that I have read,
                                            understand, and agree to all{" "}
                                            terms outlined{" "}
                                            <Link
                                                href="/terms-and-conditions#waiver"
                                                color="brand.primary"
                                                textDecoration="underline"
                                                isExternal
                                            >
                                                here
                                            </Link>. Including the Waiver, Release of
                                            Liability, Hold Harmless Agreement, Medical
                                            Authorization, and Dispute Resolution.
                                        </Text>
                                    </Checkbox>
                                )}
                            />
                        </Box>
                    </InputError>
                </FormControl>
            </>}
        </SimpleGrid>
    );
};

export default StudentFormEntryBody;
