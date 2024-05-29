import { useParams } from 'react-router-dom';
import BodyContainer from '../components/BodyContainer'
import { useEvent } from '../events';
import PageHeader from '../components/PageHeader';
import EventForm from '../events/components/EventForm';

const BoastOne = () => {
    const { id: idStr } = useParams();
    const id = idStr ? parseInt(idStr) : undefined;

    const { data: event, error, isLoading } = useEvent(id);

    if (error) throw error;
    if (isLoading || !event) return null;

    return (
        <BodyContainer>
            <PageHeader>{event.title}</PageHeader>
            <EventForm event={event} />
        </BodyContainer>
    )
}

export default BoastOne