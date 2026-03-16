import {
    Badge,
    Box,
    Heading,
    HStack,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import useStudents from "../students/hooks/useStudents";
import useForms from "../forms/hooks/useForms";
import usePickupPersons from "../forms/hooks/usePickupPersons";
import StudentFormEntry from "../forms/components/StudentFormEntry";
import PickupPersonsFormEntry from "../forms/components/PickupPersonsFormEntry";
import { StudentFormResponse } from "../forms";
import { hasFutureCamp } from "../students";


const isFormCurrentYear = (form?: StudentFormResponse): boolean => {
    if (!form?.updated_at) return false;
    const updatedDate = new Date(form.updated_at);
    const jan1 = new Date(new Date().getFullYear(), 0, 1);
    return updatedDate >= jan1;
};

const EnrollmentForms = () => {
    const { data: students, isLoading: studentsLoading } = useStudents();
    const { data: forms, isLoading: formsLoading } = useForms();
    const { data: pickupForm, isLoading: pickupLoading } = usePickupPersons();

    if (studentsLoading || formsLoading || pickupLoading) {
        return (
            <BodyContainer>
                <Box marginX="auto" width="fit-content">
                    <Spinner size="xl" />
                </Box>
            </BodyContainer>
        );
    }

    const enrolledStudents = students?.filter(hasFutureCamp) || [];

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
                Please fill out the forms below so we have all the necessary
                information for camp.
            </Text>
            <Stack spacing={4}>
                <PickupPersonsFormEntry pickupForm={pickupForm} />
                {enrolledStudents.length === 0 ? (
                    <Text>
                        No student forms needed right now. Student forms will
                        appear here when your students are enrolled in an upcoming
                        camp.
                    </Text>
                ) : (
                    enrolledStudents.map((student) => {
                        const existingForm = getFormForStudent(student.id);
                        return (
                            <HStack
                                key={student.id}
                                padding={4}
                                borderWidth="1px"
                                borderRadius="md"
                                borderColor="brand.secondary"
                                justify="space-between"
                            >
                                <HStack spacing={3}>
                                    <Text fontWeight="bold">
                                        {student.name} — Grade {student.grade_level}
                                    </Text>
                                    {isFormCurrentYear(existingForm) ? (
                                        <Badge bgColor="brand.green" color="brand.primary">
                                            Updated for {new Date().getFullYear()}
                                        </Badge>
                                    ) : existingForm ? (
                                        <Badge bgColor="brand.warning" color="brand.primary">
                                            Needs annual update
                                        </Badge>
                                    ) : (
                                        <Badge bgColor="brand.secondary" color="brand.primary">
                                            Not yet completed
                                        </Badge>
                                    )}
                                </HStack>
                                <StudentFormEntry
                                    studentId={student.id}
                                    studentName={student.name}
                                    studentGrade={student.grade_level}
                                    existingForm={existingForm}
                                />
                            </HStack>
                        );
                    })
                )}
            </Stack>
        </BodyContainer>
    );
};

export default EnrollmentForms;