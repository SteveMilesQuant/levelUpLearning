import { useDisclosure, LinkOverlay, Heading, Stack } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer"
import PageHeader from "../components/PageHeader"
import TextButton from "../components/TextButton"
import { EventFormModal } from "../events";
import { useEvents } from "../events";
import CardContainer from "../components/CardContainer";
import { Link as RouterLink } from "react-router-dom";


const Boast = () => {
    const {
        isOpen: newIsOpen,
        onOpen: newOnOpen,
        onClose: newOnClose,
    } = useDisclosure();
    const { data: events, error } = useEvents();

    if (error) throw error;

    return (
        <BodyContainer>
            <PageHeader rightButton={<TextButton onClick={newOnOpen}>Add Event</TextButton>}>Edit community events</PageHeader>
            <Stack spacing={3}>
                {events?.map(e =>
                    <CardContainer key={e.id}>
                        <LinkOverlay as={RouterLink} to={"/boast/" + e.id}>
                            <Heading fontSize="2xl">{e.title}</Heading>
                        </LinkOverlay>
                    </CardContainer>
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