import { Stack, useDisclosure, Text, Image } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer"
import PageHeader from "../components/PageHeader"
import TextButton from "../components/TextButton"
import { EventFormModal } from "../events";
import { useEvents } from "../events";


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
            {events?.map(e => {
                if (!e.title_image?.image) return;
                const blob = new Blob([e.title_image.image], { type: e.title_image?.filetype });
                return <Stack key={e.id}>
                    <Text>{e.title}</Text>
                    {e.title_image && e.title_image.image && <Image src={URL.createObjectURL(blob)} alt={e.title_image.filename} />}
                </Stack>;
            }
            )}
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