import { useState } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import useStudentFormEntry from "../hooks/useStudentFormEntry";
import { StudentFormResponse } from "../StudentFormTypes";
import StudentFormEntryBody from "./StudentFormEntryBody";
import CrudButtonSet from "../../components/CrudButtonSet";

interface Props {
    studentId: number;
    studentName: string;
    studentGrade: number;
    existingForm?: StudentFormResponse;
}

const StudentFormEntry = ({
    studentId,
    studentName,
    studentGrade,
    existingForm,
}: Props) => {
    const [isEditing, setIsEditing] = useState(!existingForm);
    const formHook = useStudentFormEntry({ studentId, existingForm });

    if (!existingForm && !isEditing) {
        return (
            <Box>
                <Text color="gray.500" marginBottom={3}>
                    No form submitted yet for {studentName}.
                </Text>
                <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                >
                    Fill Out Form
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Heading size="sm" marginBottom={1}>
                {studentName} — Grade {studentGrade}
            </Heading>
            <StudentFormEntryBody
                register={formHook.register}
                errors={formHook.errors}
                control={formHook.control}
                isReadOnly={!isEditing}
            />
            {existingForm ? (
                <CrudButtonSet
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    onCancel={formHook.handleClose}
                    onSubmit={() => {
                        formHook.handleSubmit();
                        setIsEditing(false);
                    }}
                    isSubmitValid={formHook.isValid}
                />
            ) : (
                <Button
                    colorScheme="blue"
                    marginTop={4}
                    onClick={() => {
                        formHook.handleSubmit();
                    }}
                >
                    Submit
                </Button>
            )}
        </Box>
    );
};

export default StudentFormEntry;
