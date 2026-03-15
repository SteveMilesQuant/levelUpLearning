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
    Text,
} from "@chakra-ui/react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
    allergies: string;
}

const StudentAllergyModal = ({ isOpen, onClose, studentName, allergies }: Props) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading size="md">{studentName} — Allergies & Health Concerns</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>{allergies || "No allergy details provided."}</Text>
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

export default StudentAllergyModal;
