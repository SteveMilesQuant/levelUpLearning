import { useState } from "react";
import {
    Button,
    Heading,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
} from "@chakra-ui/react";
import { StudentFormResponse } from "../../forms/StudentFormTypes";
import useStudentFormEntry from "../../forms/hooks/useStudentFormEntry";
import StudentFormEntryBody, {
    FORM_PAGE_TITLES,
    FORM_TOTAL_PAGES,
} from "../../forms/components/StudentFormEntryBody";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
    studentGrade: number;
    form: StudentFormResponse;
}

const StudentFormViewModal = ({ isOpen, onClose, studentName, studentGrade, form }: Props) => {
    const [page, setPage] = useState(0);
    const formHook = useStudentFormEntry({ studentId: form.student_id, existingForm: form });

    const handleClose = () => {
        setPage(0);
        onClose();
    };

    const isLastPage = page === FORM_TOTAL_PAGES - 1;

    return (
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
                        isReadOnly={true}
                        page={page}
                        studentGrade={form.student_grade_level}
                    />
                </ModalBody>
                <ModalFooter>
                    <HStack spacing={3} width="full" justify="space-between">
                        <Button
                            variant="ghost"
                            onClick={() => setPage((p) => p - 1)}
                            isDisabled={page === 0}
                            color="brand.primary"
                        >
                            Back
                        </Button>
                        <HStack spacing={3}>
                            <Button variant="ghost" onClick={handleClose} color="brand.primary">
                                Close
                            </Button>
                            {!isLastPage && (
                                <Button
                                    bgColor="brand.buttonBg"
                                    color="brand.primary"
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next
                                </Button>
                            )}
                        </HStack>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default StudentFormViewModal;
