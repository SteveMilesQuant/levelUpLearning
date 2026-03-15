import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Divider,
    Heading,
    HStack,
    Stack,
    Checkbox,
    Input,
    FormControl,
    FormLabel,
    Text,
    Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Student } from "../Student";
import usePickup from "../hooks/usePickup";
import CancelButton from "../../components/CancelButton";
import AlertMessage from "../../components/AlertMessage";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    campId: number;
    student: Student;
    campStudents: Student[];
    onSuccess: (pickupPersonName: string) => void;
}

const PickupModal = ({
    isOpen,
    onClose,
    campId,
    student,
    campStudents,
    onSuccess,
}: Props) => {
    const guardianIds = new Set(student.guardians.map((g) => g.id));

    const siblings = campStudents.filter(
        (s) =>
            s.id !== student.id &&
            s.guardians.some((g) => guardianIds.has(g.id))
    );

    const allPickupStudents = [student, ...siblings];

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [code, setCode] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Reset state whenever modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedIds(allPickupStudents.map((s) => s.id));
            setCode("");
            setErrorMsg(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const { mutate: submitPickup, isLoading } = usePickup(campId);

    const toggleStudent = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        setErrorMsg(null);
        submitPickup(
            { student_ids: selectedIds, code },
            {
                onSuccess: (data) => {
                    onSuccess(data.pickup_person_name);
                    onClose();
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
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading fontSize="2xl">Student Pickup</Heading>
                    <Divider orientation="horizontal" marginTop={1} />
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={4}>
                        {errorMsg && (
                            <AlertMessage status="error" onClose={() => setErrorMsg(null)}>
                                {errorMsg}
                            </AlertMessage>
                        )}
                        <FormControl>
                            <FormLabel>Who is being picked up?</FormLabel>
                            <Stack spacing={2} paddingX={2}>
                                {allPickupStudents.map((s) => (
                                    <Checkbox
                                        key={s.id}
                                        isChecked={selectedIds.includes(s.id)}
                                        onChange={() => toggleStudent(s.id)}
                                    >
                                        <Text>
                                            {s.name}
                                            {s.id !== student.id && (
                                                <Text as="span" color="gray.500" fontSize="sm">
                                                    {" "}(sibling)
                                                </Text>
                                            )}
                                        </Text>
                                    </Checkbox>
                                ))}
                            </Stack>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Pickup code</FormLabel>
                            <Input
                                value={code}
                                onChange={(e) =>
                                    setCode(e.target.value.toUpperCase().slice(0, 6))
                                }
                                placeholder="6-letter code"
                                maxLength={6}
                                letterSpacing="widest"
                                fontWeight="bold"
                            />
                        </FormControl>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <HStack justifyContent="right" spacing={3}>
                        <CancelButton onClick={onClose}>Cancel</CancelButton>
                        <Button
                            bgColor="brand.buttonBg"
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            isDisabled={code.length !== 6 || selectedIds.length === 0}
                        >
                            Submit
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PickupModal;
