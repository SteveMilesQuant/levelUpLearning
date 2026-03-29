import { Box, HStack, Tooltip, useDisclosure } from "@chakra-ui/react";
import { FaWpforms } from "react-icons/fa";
import { MdNoPhotography, MdWarning } from "react-icons/md";
import { TbFileOff } from "react-icons/tb";
import { Student } from "../Student";
import { isFormCurrentYear } from "../../forms/StudentFormTypes";
import useForms from "../../forms/hooks/useForms";
import StudentFormViewModal from "./StudentFormViewModal";
import StudentAllergyModal from "./StudentAllergyModal";

interface Props {
    student: Student;
}

const StudentFormIcons = ({ student }: Props) => {
    const { data: forms } = useForms();
    const { isOpen: formIsOpen, onOpen: formOnOpen, onClose: formOnClose } = useDisclosure();
    const { isOpen: allergyIsOpen, onOpen: allergyOnOpen, onClose: allergyOnClose } = useDisclosure();

    const form = forms?.find((f) => f.student_id === student.id);
    const hasCurrentForm = isFormCurrentYear(form);

    if (!hasCurrentForm) {
        return (
            <Tooltip label="No form">
                <Box as="span" color="brand.danger" display="inline-flex">
                    <TbFileOff size="1.5em" />
                </Box>
            </Tooltip>
        );
    }

    return (
        <>
            <HStack spacing={2}>
                <Tooltip label="View form">
                    <Box
                        as="span"
                        display="inline-flex"
                        cursor="pointer"
                        onClick={formOnOpen}
                    >
                        <FaWpforms size="1.5em" />
                    </Box>
                </Tooltip>

                {form!.has_allergies === true && (
                    <Tooltip label="Has allergies">
                        <Box
                            as="span"
                            color="brand.danger"
                            display="inline-flex"
                            cursor="pointer"
                            onClick={allergyOnOpen}
                        >
                            <MdWarning size="1.5em" />
                        </Box>
                    </Tooltip>
                )}

                {form!.photo_permission === false && (
                    <Tooltip label="No photos allowed">
                        <Box as="span" color="brand.danger" display="inline-flex">
                            <MdNoPhotography size="1.5em" />
                        </Box>
                    </Tooltip>
                )}
            </HStack>

            <StudentFormViewModal
                isOpen={formIsOpen}
                onClose={formOnClose}
                studentName={student.name}
                studentGrade={student.grade_level}
                form={form!}
            />

            {form!.has_allergies === true && (
                <StudentAllergyModal
                    isOpen={allergyIsOpen}
                    onClose={allergyOnClose}
                    studentName={student.name}
                    allergies={form!.allergies}
                />
            )}
        </>
    );
};

export default StudentFormIcons;
