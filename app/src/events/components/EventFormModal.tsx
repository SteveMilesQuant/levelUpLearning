import { Divider, HStack, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import CancelButton from "../../components/CancelButton";
import SubmitButton from "../../components/SubmitButton";
import EventFormBody from "./EventFormBody";
import useEventForm from "../hooks/useEventForm";
import { Event } from "../Event";
import { useState } from "react";
import { CACHE_KEY_EVENTS, addCarouselImage, postTitleImage } from "../hooks/useEvents";
import { useQueryClient } from "@tanstack/react-query";
import { ImageFile } from "../../interfaces/Image";

interface Props {
    title: string;
    listIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

const EventFormModal = ({ title, listIndex, isOpen, onClose }: Props) => {
    const queryClient = useQueryClient();

    const [titleImage, setTitleImage] = useState<ImageFile | undefined>();
    const [carouselImages, setCarouselImages] = useState<ImageFile[]>([]);

    const handleSuccessWithBluntForce = () => {
        queryClient.invalidateQueries({
            queryKey: CACHE_KEY_EVENTS,
            exact: false,
        });
    }

    const updateTitleImage = (event: Event) => {
        if (!titleImage) return;
        postTitleImage(event.id, titleImage, handleSuccessWithBluntForce);
        setTitleImage(undefined);
    }
    const updateCarouselImages = (event: Event) => {
        for (var i = 0; i < carouselImages.length; i++) {
            const image = carouselImages[i];
            addCarouselImage(event.id, image, handleSuccessWithBluntForce);
        }
    }
    const handleFormSuccess = (event: Event) => {
        updateTitleImage(event);
        updateCarouselImages(event);
    }
    const eventForm = useEventForm({ list_index: listIndex } as Event, handleFormSuccess);


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
                    {<EventFormBody {...eventForm}
                        titleImage={titleImage}
                        setTitleImage={setTitleImage}
                        carouselImages={carouselImages}
                        setCarouselImages={setCarouselImages} />}
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