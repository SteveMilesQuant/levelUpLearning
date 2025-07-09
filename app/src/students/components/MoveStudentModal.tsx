import { Divider, FormControl, FormLabel, Heading, HStack, Text, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack } from "@chakra-ui/react";
import { Student } from "../Student";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import { formatCamp, useCamp, useCamps } from "../../camps";
import { ChangeEvent, useState } from "react";
import { useStudentMove } from "../hooks/useStudents";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    student: Student;
    campId: number;
}

const MoveStudentModal = ({ isOpen, onClose, student, campId }: Props) => {
    const { data: camp } = useCamp(campId);
    const { data: camps } = useCamps({ is_published: true }, false);
    const [selectedCampId, setSelectedCampId] = useState<undefined | number>(undefined);
    const moveStudent = useStudentMove(student.id, { onSubmit: onClose });

    if (!camp || !camps) return null;

    const guardiansStr =
        student.guardians
            ?.map((g) => `${g.full_name} (${g.email_address})`)
            .join(", ")
        ;

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value, 10);
        setSelectedCampId(selectedId);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="3xl"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading fontSize="2xl">Move student</Heading>
                    <Divider orientation="horizontal" marginTop={1}></Divider>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={5}>
                        <FormControl>
                            <FormLabel>Student</FormLabel>
                            <Select isDisabled={true}>
                                <option value="">{`#${student.id}: ${student.name}; Guardians: ${guardiansStr}`}</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>From camp</FormLabel>
                            <Select isDisabled={true}>
                                <option value="">{`#${camp.id}: ` + formatCamp(camp)}</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>To camp</FormLabel>
                            <Select onChange={handleChange} placeholder="Select camp">
                                {camps.filter(c => c.id !== camp.id).map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {`#${c.id}: ` + formatCamp(c)}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <HStack justifyContent="right" spacing={3}>
                        <CancelButton onClick={onClose}>Cancel</CancelButton>
                        <SubmitButton
                            onClick={() => {
                                if (selectedCampId) moveStudent({ from_camp_id: campId, to_camp_id: selectedCampId });
                            }}
                        >
                            Submit
                        </SubmitButton>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default MoveStudentModal