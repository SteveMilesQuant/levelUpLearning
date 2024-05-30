import { useEffect, useState } from 'react';
import EventFormBody from './EventFormBody'
import { useQueryClient } from '@tanstack/react-query';
import { CACHE_KEY_EVENTS, addCarouselImage, deleteCarouselImage, postTitleImage, updateCarouselImage, useDeleteEvent } from '../hooks/useEvents';
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
        if (!titleImage || titleImage.id) return;
        postTitleImage(event.id, titleImage, handleSuccessWithBluntForce);
    }
    const updateCarouselImages = () => {
        for (var i = 0; i < imageDeleteList.length; i++) {
            const image = imageDeleteList[i];
            deleteCarouselImage(event.id, image.id, handleSuccessWithBluntForce);
        }
        for (var i = 0; i < carouselImages.length; i++) {
            const image = carouselImages[i];
            if (image.id) {
                updateCarouselImage(event.id, image, handleSuccessWithBluntForce);
            }
            else {
                addCarouselImage(event.id, image, handleSuccessWithBluntForce);
            }
        }
    }
    const handleFormSuccess = () => {
        updateTitleImage();
        updateCarouselImages();
    }
    const eventForm = useEventForm(event, handleFormSuccess);

    const resetTitleImage = () => {
        if (!event.title_image || !event.title_image.image || !event.title_image.filename) {
            setTitleImage(undefined);
        }
        else {
            const file = new File([event.title_image.image], event.title_image.filename, { type: event.title_image.filetype });
            setTitleImage({ id: event.title_image.id, file, url: URL.createObjectURL(file), index: 0 });
        }
    }
    useEffect(() => {
        resetTitleImage();
    }, [!!event.title_image]);

    const resetCarouselImages = () => {
        var newImageList = [];
        if (event.carousel_images) {
            for (var i = 0; i < event.carousel_images.length; i++) {
                const image = event.carousel_images[i];
                if (image.image && image.filename && image.filetype) {
                    const file = new File([image.image], image.filename, { type: image.filetype });
                    newImageList.push({ id: image.id, file, url: URL.createObjectURL(file), index: image.list_index } as ImageFile);
                }
            }
        }
        setCarouselImages(newImageList);
    }
    useEffect(() => {
        resetCarouselImages();
    }, [!!event.carousel_images]);

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