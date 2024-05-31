import { HStack, Heading, LinkOverlay } from "@chakra-ui/react";
import CardContainer from "../../components/CardContainer";
import { Event, EventData } from "../Event";
import { Link as RouterLink } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useUpdateEvent } from "../hooks/useEvents";

interface Props {
    event: Event;
    eventsLength: number;
}

const EventCard = ({ event, eventsLength }: Props) => {
    const updateEvent = useUpdateEvent();

    const handleMoveEventUp = (index: number) => {
        if (index === 0) return;
        updateEvent.mutate({ ...event, list_index: event.list_index - 1 } as Event);
    }
    const handleMoveEventDown = (index: number) => {
        if (index === eventsLength - 1) return;
        updateEvent.mutate({ ...event, list_index: event.list_index + 1 } as Event);
    }

    return (
        <CardContainer key={event.id}>
            <HStack justify="space-between">
                <LinkOverlay as={RouterLink} to={"/boast/" + event.id}>
                    <Heading fontSize="2xl">{event.title}</Heading>
                </LinkOverlay>
                <HStack>
                    <ActionButton
                        Component={FaArrowUp}
                        label="Move up"
                        onClick={() => handleMoveEventUp(event.list_index)}
                        disabled={event.list_index === 0}
                    />
                    <ActionButton
                        Component={FaArrowDown}
                        label="Move down"
                        onClick={() => handleMoveEventDown(event.list_index)}
                        disabled={event.list_index === eventsLength - 1}
                    />
                </HStack>
            </HStack>
        </CardContainer>
    )
}

export default EventCard