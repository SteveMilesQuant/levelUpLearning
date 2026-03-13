import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Badge,
    Box,
    Heading,
    HStack,
    Spinner,
    Text,
} from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import useStudents from "../students/hooks/useStudents";
import useForms from "../forms/hooks/useForms";
import StudentFormEntry from "../forms/components/StudentFormEntry";
import { StudentFormResponse } from "../forms";

const EnrollmentForms = () => {
    const { data: students, isLoading: studentsLoading } = useStudents();
    const { data: forms, isLoading: formsLoading } = useForms();

    if (studentsLoading || formsLoading) {
        return (
            <BodyContainer>
                <Box marginX="auto" width="fit-content">
                    <Spinner size="xl" />
                </Box>
            </BodyContainer>
        );
    }

    if (!students || students.length === 0) {
        return (
            <BodyContainer>
                <Heading size="lg" marginBottom={4}>
                    Student Information Forms
                </Heading>
                <Text>
                    You don't have any students yet. Add a student first, then come back
                    to fill out their information form.
                </Text>
            </BodyContainer>
        );
    }

    const getFormForStudent = (
        studentId: number
    ): StudentFormResponse | undefined => {
        return forms?.find((f) => f.student_id === studentId);
    };

    return (
        <BodyContainer>
            <Heading size="lg" marginBottom={2}>
                Student Information Forms
            </Heading>
            <Text marginBottom={6} color="brand.text">
                Please fill out the form below for each of your students so we have all
                the necessary information for camp.
            </Text>
            <Accordion allowMultiple defaultIndex={students.length === 1 ? [0] : []}>
                {students.map((student) => {
                    const existingForm = getFormForStudent(student.id);
                    return (
                        <AccordionItem key={student.id}>
                            <AccordionButton>
                                <HStack flex="1" textAlign="left" spacing={3}>
                                    <Text fontWeight="bold">
                                        {student.name} — Grade {student.grade_level}
                                    </Text>
                                    {existingForm ? (
                                        <Badge bgColor="brand.green" color="brand.primary">Completed</Badge>
                                    ) : (
                                        <Badge bgColor="brand.secondary" color="brand.primary">Not yet completed</Badge>
                                    )}
                                </HStack>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <StudentFormEntry
                                    studentId={student.id}
                                    studentName={student.name}
                                    studentGrade={student.grade_level}
                                    existingForm={existingForm}
                                />
                            </AccordionPanel>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </BodyContainer>
    );
};

export default EnrollmentForms;