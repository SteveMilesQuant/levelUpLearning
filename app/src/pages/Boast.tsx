import { useDisclosure, Stack, Spinner } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer"
import PageHeader from "../components/PageHeader"
import TextButton from "../components/TextButton"
import { EventFormModal, EventCard, useEvents } from "../events";


const Boast = () => {
    const {
        isOpen: newIsOpen,
        onOpen: newOnOpen,
        onClose: newOnClose,
    } = useDisclosure();
    const { data: events, error, isLoading } = useEvents();

    if (error) throw error;
    if (isLoading) return <Spinner />;



    return (
        <BodyContainer>
            <PageHeader rightButton={<TextButton onClick={newOnOpen}>Add Event</TextButton>}>Edit community events</PageHeader>
            <Stack spacing={3}>
                {events?.map(event =>
                    <EventCard event={event} eventsLength={events.length} />
                )}
            </Stack>
            <EventFormModal
                title="Add Event"
                isOpen={newIsOpen}
                onClose={newOnClose}
                listIndex={events ? events.length : 0}
            />
        </BodyContainer>
    )
}

export default Boast