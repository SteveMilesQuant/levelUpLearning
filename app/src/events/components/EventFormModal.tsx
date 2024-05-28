import { Divider, HStack, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import EventFormBody from "./EventFormBody";
import useEventForm from "../hooks/useEventForm";

interface Props {
    title: string;
    isOpen: boolean;
    onClose: () => void;
}

const EventFormModal = ({ title, isOpen, onClose }: Props) => {
    const eventForm = useEventForm();

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                eventForm.handleClose();
                onClose();
            }}
            size="3xl"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading fontSize="2xl">{title}</Heading>
                    <Divider orientation="horizontal" marginTop={1}></Divider>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {<EventFormBody {...eventForm} />}
                </ModalBody>
                <ModalFooter>
                    <HStack justifyContent="right" spacing={3}>
                        <CancelButton onClick={onClose}>Cancel</CancelButton>
                        <SubmitButton
                            onClick={() => {
                                eventForm.handleSubmit();
                                if (eventForm.isValid) {
                                    eventForm.handleClose();
                                    onClose();
                                }
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

export default EventFormModal