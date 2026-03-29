import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    Switch,
    Text,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import BodyContainer from "../components/BodyContainer";
import PageHeader from "../components/PageHeader";
import AlertMessage from "../components/AlertMessage";
import usePickupLookup, {
    PickupStudentInfo,
} from "../camps/hooks/usePickupLookup";
import usePickup from "../students/hooks/usePickup";
import TextButton from "../components/TextButton";
import CampsContext, { CampsContextType } from "../camps/campsContext";

const Pickup = () => {
    const { id: idStr } = useParams();
    const campId = idStr ? parseInt(idStr) : 0;
    const navigate = useNavigate();
    const campsContextType = useContext(CampsContext);

    const [code, setCode] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Lookup result state
    const [pickupPersonName, setPickupPersonName] = useState<string | null>(null);
    const [students, setStudents] = useState<PickupStudentInfo[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [pickUpAll, setPickUpAll] = useState(true);

    const { mutate: lookupCode, isLoading: isLookingUp } =
        usePickupLookup(campId);
    const { mutate: submitPickup, isLoading: isSubmitting } = usePickup(campId);

    const handleLookup = () => {
        setErrorMsg(null);
        setSuccessMsg(null);
        lookupCode(code, {
            onSuccess: (data) => {
                setPickupPersonName(data.pickup_person_name);
                setStudents(data.students);
                setSelectedIds(data.students.map((s) => s.id));
                setPickUpAll(true);
            },
            onError: (err: any) => {
                const detail =
                    err?.response?.data?.detail ?? "An error occurred. Please try again.";
                setErrorMsg(detail);
            },
        });
    };

    const handleSubmit = () => {
        setErrorMsg(null);
        submitPickup(
            { student_ids: selectedIds, code },
            {
                onSuccess: (data) => {
                    setSuccessMsg(`Pickup by ${data.pickup_person_name} was successful.`);
                    // Reset for next pickup
                    setPickupPersonName(null);
                    setStudents([]);
                    setSelectedIds([]);
                    setPickUpAll(true);
                    setCode("");
                },
                onError: (err: any) => {
                    const detail =
                        err?.response?.data?.detail ??
                        "An error occurred. Please try again.";
                    setErrorMsg(detail);
                },
            }
        );
    };

    const toggleStudent = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const handleReset = () => {
        setPickupPersonName(null);
        setStudents([]);
        setSelectedIds([]);
        setPickUpAll(true);
        setCode("");
        setErrorMsg(null);
        setSuccessMsg(null);
    };

    const handlePickUpAllToggle = () => {
        const next = !pickUpAll;
        setPickUpAll(next);
        if (next) {
            setSelectedIds(students.map((s) => s.id));
        }
    };

    const backPath =
        campsContextType === CampsContextType.schedule
            ? `/schedule/${campId}`
            : `/teach/${campId}`;

    return (
        <BodyContainer>
            <PageHeader
                rightButton={
                    <TextButton onClick={() => navigate(backPath)}>Back to camp</TextButton>
                }
            >
                Student Pickup
            </PageHeader>

            <Stack spacing={5} maxWidth="500px">
                {errorMsg && (
                    <AlertMessage status="error" onClose={() => setErrorMsg(null)}>
                        {errorMsg}
                    </AlertMessage>
                )}
                {successMsg && (
                    <AlertMessage status="success" onClose={() => setSuccessMsg(null)}>
                        {successMsg}
                    </AlertMessage>
                )}

                {/* Step 1: Enter code */}
                {!pickupPersonName && (
                    <Stack spacing={4}>
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
                                autoFocus
                            />
                        </FormControl>
                        <Box>
                            <Button
                                bgColor="brand.buttonBg"
                                onClick={handleLookup}
                                isLoading={isLookingUp}
                                isDisabled={code.length !== 6}
                            >
                                Look up
                            </Button>
                        </Box>
                    </Stack>
                )}

                {/* Step 2: Confirm students */}
                {pickupPersonName && (
                    <Stack spacing={4}>
                        <Heading fontSize="xl">
                            Pickup by: {pickupPersonName}
                        </Heading>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="pickup-all" mb="0">Pick up all</FormLabel>
                            <Switch
                                id="pickup-all"
                                isChecked={pickUpAll}
                                onChange={handlePickUpAllToggle}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Who is being picked up?</FormLabel>
                            <Stack spacing={2} paddingX={2}>
                                {students.map((s) => (
                                    <Checkbox
                                        key={s.id}
                                        isChecked={selectedIds.includes(s.id)}
                                        isDisabled={pickUpAll}
                                        onChange={() => toggleStudent(s.id)}
                                    >
                                        <Text>{s.name}</Text>
                                    </Checkbox>
                                ))}
                            </Stack>
                        </FormControl>
                        <HStack spacing={3}>
                            <Button
                                bgColor="brand.buttonBg"
                                onClick={handleSubmit}
                                isLoading={isSubmitting}
                                isDisabled={selectedIds.length === 0}
                            >
                                Submit Pickup
                            </Button>
                            <TextButton onClick={handleReset}>Cancel</TextButton>
                        </HStack>
                    </Stack>
                )}
            </Stack>
        </BodyContainer>
    );
};

export default Pickup;
