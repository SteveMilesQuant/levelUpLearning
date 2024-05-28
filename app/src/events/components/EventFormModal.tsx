import { Divider, HStack, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import EventFormBody from "./EventFormBody";
import useEventForm from "../hooks/useEventForm";
import { Event } from "../Event";
import { useState } from "react";
import { postTitleImage } from "../hooks/useEvents";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
    title: string;
    listIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

const EventFormModal = ({ title, listIndex, isOpen, onClose }: Props) => {
    const [titleImage, setTitleImage] = useState<{ file: File; url: string } | undefined>();
    const queryClient = useQueryClient();
    const updateTitleImage = (event: Event) => {
        if (!titleImage) return;
        const formData = new FormData();
        formData.append("file", titleImage.file, titleImage.file.name);
        postTitleImage(queryClient, event.id, formData);
    }
    const eventForm = useEventForm({ list_index: listIndex } as Event, updateTitleImage);

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
                    {<EventFormBody {...eventForm} titleImage={titleImage} setTitleImage={setTitleImage} />}
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