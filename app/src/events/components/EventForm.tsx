import { useEffect, useState } from 'react';
import EventFormBody from './EventFormBody'
import { useQueryClient } from '@tanstack/react-query';
import { postTitleImage } from '../hooks/useEvents';
import useEventForm from '../hooks/useEventForm';
import { Event } from '../Event'

interface Props {
    event: Event;
}

const EventForm = ({ event }: Props) => {
    const [titleImage, setTitleImage] = useState<{ file: File; url: string } | undefined>();
    const queryClient = useQueryClient();
    const updateTitleImage = (newEvent: Event) => {
        if (!titleImage) return;
        const formData = new FormData();
        formData.append("file", titleImage.file, titleImage.file.name);
        postTitleImage(queryClient, event.id, formData);
        setTitleImage(undefined);
    }
    const eventForm = useEventForm(event, updateTitleImage);

    useEffect(() => {
        if (!event.title_image || !event.title_image.image || !event.title_image.filename) return;
        const file = new File([event.title_image.image], event.title_image.filename, { type: event.title_image.filetype });
        setTitleImage({ file, url: URL.createObjectURL(file) });
    }, [!!event.title_image]);

    return (
        <EventFormBody {...eventForm} titleImage={titleImage} setTitleImage={setTitleImage} />
    )
}

export default EventForm