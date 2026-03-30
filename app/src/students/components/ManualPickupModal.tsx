import {
    Button,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Radio,
    RadioGroup,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import useStudentPickupPersons from "../hooks/useStudentPickupPersons";
import usePickup from "../hooks/usePickup";
import AlertMessage from "../../components/AlertMessage";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    campId: number;
    studentId: number;
    studentName: string;
}

const ManualPickupModal = ({ isOpen, onClose, campId, studentId, studentName }: Props) => {
    const { data: pickupPersons } = useStudentPickupPersons(campId, studentId);
    const { mutate: submitPickup, isLoading: isSubmitting } = usePickup(campId);
    const [selectedId, setSelectedId] = useState<string>("");
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleClose = () => {
        setSelectedId("");
        setSuccessMsg(null);
        setErrorMsg(null);
        onClose();
    };

    const handleSubmit = () => {
        setErrorMsg(null);
        setSuccessMsg(null);
        submitPickup(
            { student_ids: [studentId], pickup_person_id: parseInt(selectedId) },
            {
                onSuccess: (data) => {
                    setSuccessMsg(`Pickup by ${data.pickup_person_name} was successful.`);
                    setSelectedId("");
                },
                onError: (err: any) => {
                    const detail =
                        err?.response?.data?.detail ?? "An error occurred. Please try again.";
                    setErrorMsg(detail);
                },
            }
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading size="md">{studentName} — Manual Pickup</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {successMsg && (
                        <AlertMessage status="success" onClose={() => setSuccessMsg(null)}>
                            {successMsg}
                        </AlertMessage>
                    )}
                    {errorMsg && (
                        <AlertMessage status="error" onClose={() => setErrorMsg(null)}>
                            {errorMsg}
                        </AlertMessage>
                    )}
                    {pickupPersons && pickupPersons.length > 0 ? (
                        <RadioGroup value={selectedId} onChange={setSelectedId}>
                            <Table size="sm">
                                <Thead>
                                    <Tr>
                                        <Th></Th>
                                        <Th>Name</Th>
                                        <Th>Phone</Th>
                                        <Th>Guardian</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {pickupPersons.map((pp) => (
                                        <Tr key={pp.id} cursor="pointer" onClick={() => setSelectedId(String(pp.id))}>
                                            <Td>
                                                <Radio value={String(pp.id)} colorScheme="orange" />
                                            </Td>
                                            <Td>{pp.name}</Td>
                                            <Td>{pp.phone}</Td>
                                            <Td>{pp.guardian_name}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </RadioGroup>
                    ) : (
                        <Text>No pickup persons found for this student.</Text>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Stack direction="row" spacing={3}>
                        <Button
                            colorScheme="orange"
                            isDisabled={!selectedId || isSubmitting}
                            isLoading={isSubmitting}
                            onClick={handleSubmit}
                        >
                            Submit Pickup
                        </Button>
                        <Button variant="ghost" onClick={handleClose} color="brand.primary">
                            Close
                        </Button>
                    </Stack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ManualPickupModal;
