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
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { StudentPickupPerson } from "../../forms/PickupPersonsTypes";
import useUpdateSmsConsent from "../hooks/useUpdateSmsConsent";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
    pickupPersons: StudentPickupPerson[];
}

const consentLabel = (sms_consent: boolean | null): string => {
    if (sms_consent === true) return "Consented";
    if (sms_consent === false) return "Denied";
    return "Unconfirmed";
};

const PickupPersonsModal = ({ isOpen, onClose, studentName, pickupPersons }: Props) => {
    const updateConsent = useUpdateSmsConsent();

    const handleConsentChange = (pickupPersonId: number, value: string) => {
        const sms_consent = value === "Consented" ? true : value === "Denied" ? false : null;
        updateConsent.mutate({ pickupPersonId, sms_consent });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading size="md">{studentName} — Pickup Persons</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Table size="sm">
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Phone</Th>
                                <Th>Guardian</Th>
                                <Th>SMS Consent</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {pickupPersons.map((pp) => (
                                <Tr key={pp.id}>
                                    <Td>{pp.name}</Td>
                                    <Td>{pp.phone}</Td>
                                    <Td>{pp.guardian_name}</Td>
                                    <Td>
                                        <Select
                                            size="sm"
                                            value={consentLabel(pp.sms_consent)}
                                            onChange={(e) => handleConsentChange(pp.id, e.target.value)}
                                        >
                                            <option value="Unconfirmed">Unconfirmed</option>
                                            <option value="Consented">Consented</option>
                                            <option value="Denied">Denied</option>
                                        </Select>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose} color="brand.primary">
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PickupPersonsModal;
