import { useState } from "react";
import {
    Box,
    Button,
    Heading,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import useStudentFormEntry from "../hooks/useStudentFormEntry";
import { useUpdateStudent } from "../../students/hooks/useStudents";
import { StudentFormResponse } from "../StudentFormTypes";
import StudentFormEntryBody, {
    FORM_PAGE_TITLES,
    FORM_TOTAL_PAGES,
    FIELD_TO_PAGE,
} from "./StudentFormEntryBody";

interface Props {
    studentId: number;
    studentName: string;
    studentGrade: number;
    existingForm?: StudentFormResponse;
}

const isFormCurrentYear = (form?: StudentFormResponse): boolean => {
    if (!form?.updated_at) return false;
    const updatedDate = new Date(form.updated_at);
    const jan1 = new Date(new Date().getFullYear(), 0, 1);
    return updatedDate >= jan1;
};

const StudentFormEntry = ({
    studentId,
    studentName,
    studentGrade,
    existingForm,
}: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [page, setPage] = useState(0);
    const [grade, setGrade] = useState(studentGrade);
    const formHook = useStudentFormEntry({ studentId, existingForm });
    const updateStudent = useUpdateStudent();

    const handleOpen = () => {
        setPage(0);
        setGrade(studentGrade);
        onOpen();
    };

    const handleClose = () => {
        formHook.handleClose();
        setPage(0);
        onClose();
    };

    const handleNext = () => {
        if (page < FORM_TOTAL_PAGES - 1) setPage(page + 1);
    };

    const handleBack = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleSubmit = async () => {
        const isValid = await formHook.triggerValidation();
        if (!isValid) {
            // Navigate to the first page that has errors
            const errorFields = Object.keys(formHook.errors);
            const errorPages = errorFields
                .map((f) => FIELD_TO_PAGE[f])
                .filter((p) => p !== undefined);
            if (errorPages.length > 0) {
                setPage(Math.min(...errorPages));
            }
            return;
        }

        if (grade !== studentGrade) {
            updateStudent.mutate({
                id: studentId,
                name: studentName,
                grade_level: grade,
                student_camps: [],
                guardians: [],
            });
        }
        formHook.handleSubmit();
        onClose();
    };

    const isLastPage = page === FORM_TOTAL_PAGES - 1;

    return (
        <Box>
            <Button
                bgColor="brand.buttonBg"
                color="brand.primary"
                size="sm"
                onClick={handleOpen}
            >
                {!existingForm
                    ? "Fill Out Form"
                    : isFormCurrentYear(existingForm)
                        ? "View / Edit Form"
                        : "Update Form"}
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="md">
                            {studentName} — Grade {studentGrade}
                        </Heading>
                        <Text fontSize="sm" color="brand.text" fontWeight="normal" marginTop={1}>
                            {FORM_PAGE_TITLES[page]} (Step {page + 1} of {FORM_TOTAL_PAGES})
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <StudentFormEntryBody
                            register={formHook.register}
                            errors={formHook.errors}
                            control={formHook.control}
                            page={page}
                            studentGrade={grade}
                            onGradeChange={setGrade}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <HStack spacing={3} width="full" justify="space-between">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                isDisabled={page === 0}
                                color="brand.primary"
                            >
                                Back
                            </Button>
                            <HStack spacing={3}>
                                <Button variant="ghost" onClick={handleClose} color="brand.primary">
                                    Cancel
                                </Button>
                                {isLastPage ? (
                                    <Button
                                        bgColor="brand.buttonBg"
                                        color="brand.primary"
                                        onClick={handleSubmit}
                                    >
                                        {existingForm ? "Update" : "Submit"}
                                    </Button>
                                ) : (
                                    <Button
                                        bgColor="brand.buttonBg"
                                        color="brand.primary"
                                        onClick={handleNext}
                                    >
                                        Next
                                    </Button>
                                )}
                            </HStack>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default StudentFormEntry;
