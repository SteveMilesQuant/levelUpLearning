import { useEffect, useState } from 'react';
import EventFormBody from './EventFormBody'
import { useQueryClient } from '@tanstack/react-query';
import { CACHE_KEY_EVENTS, addCarouselImage, deleteImage, postTitleImage, updateCarouselImageOrder, useDeleteEvent } from '../hooks/useEvents';
import useEventForm from '../hooks/useEventForm';
import { Event } from '../Event'
import CrudButtonSet from '../../components/CrudButtonSet';
import { Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ImageFile } from '../../interfaces/Image';

interface Props {
    event: Event;
}

const EventForm = ({ event }: Props) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [titleImage, setTitleImage] = useState<ImageFile | undefined>(undefined);
    const [carouselImages, setCarouselImages] = useState<ImageFile[]>([]);
    const [imageDeleteList, setImageDeleteList] = useState<ImageFile[]>([]);

    const deleteEvent = useDeleteEvent({
        onDelete: () => {
            navigate("/boast");
        },
    });

    const queryClient = useQueryClient();
    const handleSuccessWithBluntForce = () => {
        queryClient.invalidateQueries({
            queryKey: CACHE_KEY_EVENTS,
            exact: false,
        });
    };

    const updateTitleImage = () => {
        if (!titleImage || titleImage.image.id || !titleImage.file) return;
        postTitleImage(event.id, titleImage.file, handleSuccessWithBluntForce);
    }
    const updateCarouselImages = () => {
        for (var i = 0; i < carouselImages.length; i++) {
            const image = carouselImages[i];
            if (image.image.id) {
                updateCarouselImageOrder(event.id, image.image, handleSuccessWithBluntForce);
            }
            else if (image.file) {
                addCarouselImage(event.id, image.image, image.file, handleSuccessWithBluntForce);
            }
        }
    }
    const updateDeleteImages = () => {
        for (var i = 0; i < imageDeleteList.length; i++) {
            const image = imageDeleteList[i];
            deleteImage(event.id, image.image.id, handleSuccessWithBluntForce);
        }
        setImageDeleteList([]);
    }
    const handleFormSuccess = () => {
        updateDeleteImages();
        updateTitleImage();
        updateCarouselImages();
    }
    const eventForm = useEventForm(event, handleFormSuccess);

    const resetTitleImage = () => {
        if (!event.title_image || !event.title_image.url || !event.title_image.filename) {
            setTitleImage(undefined);
        }
        else {
            setTitleImage({ image: { ...event.title_image, list_index: 0 }, file: undefined });
        }
    }
    useEffect(() => {
        resetTitleImage();
    }, [event.title_image]);

    const resetCarouselImages = () => {
        var newImageList: ImageFile[] = [];
        if (event.carousel_images) {
            for (var i = 0; i < event.carousel_images.length; i++) {
                const image = event.carousel_images[i];
                newImageList.push({ image: { ...image }, file: undefined });
            }
        }
        setCarouselImages(newImageList);
    }
    useEffect(() => {
        resetCarouselImages();
    }, [event.carousel_images]);

    const handleCancel = () => {
        eventForm.handleClose();
        resetTitleImage();
        resetCarouselImages();
    }

    const handleDelete = () => {
        if (event) deleteEvent.mutate(event.id);
    };

    return (
        <Stack spacing={3}>
            <EventFormBody {...eventForm}
                titleImage={titleImage}
                setTitleImage={setTitleImage}
                carouselImages={carouselImages}
                setCarouselImages={setCarouselImages}
                imageDeleteList={imageDeleteList}
                setImageDeleteList={setImageDeleteList}
                isReadOnly={!isEditing} />
            <CrudButtonSet
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onDelete={handleDelete}
                confirmationLabel={event?.title}
                onCancel={handleCancel}
                onSubmit={eventForm.handleSubmit}
                isSubmitValid={eventForm.isValid} />
        </Stack>
    )
}

export default EventForm