import { useEffect, useState } from 'react';
import EventFormBody from './EventFormBody'
import { useQueryClient } from '@tanstack/react-query';
import { postTitleImage, useDeleteEvent } from '../hooks/useEvents';
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
    const queryClient = useQueryClient();
    const deleteEvent = useDeleteEvent({
        onDelete: () => {
            navigate("/boast");
        },
    });

    const updateTitleImage = () => {
        if (!titleImage || titleImage.id) return;
        const formData = new FormData();
        formData.append("file", titleImage.file, titleImage.file.name);
        postTitleImage(queryClient, event.id, formData);
    }
    const eventForm = useEventForm(event, updateTitleImage);

    const resetTitleImage = () => {
        if (!event.title_image || !event.title_image.image || !event.title_image.filename) {
            setTitleImage(undefined);
        }
        else {
            const file = new File([event.title_image.image], event.title_image.filename, { type: event.title_image.filetype });
            setTitleImage({ id: event.title_image.id, file, url: URL.createObjectURL(file) });
        }
    }
    useEffect(() => {
        resetTitleImage();
    }, [!!event.title_image]);

    const handleCancel = () => {
        eventForm.handleClose();
        resetTitleImage();
    }

    const handleDelete = () => {
        if (event) deleteEvent.mutate(event.id);
    };

    return (
        <Stack spacing={3}>
            <EventFormBody {...eventForm} titleImage={titleImage} setTitleImage={setTitleImage} isReadOnly={!isEditing} />
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