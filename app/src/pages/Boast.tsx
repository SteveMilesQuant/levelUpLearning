import { useDisclosure } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer"
import PageHeader from "../components/PageHeader"
import TextButton from "../components/TextButton"
import { EventFormModal } from "../events";


const Boast = () => {
    const {
        isOpen: newIsOpen,
        onOpen: newOnOpen,
        onClose: newOnClose,
    } = useDisclosure();

    return (
        <BodyContainer>
            <PageHeader rightButton={<TextButton onClick={newOnOpen}>Add Event</TextButton>}>Edit community events</PageHeader>
            <EventFormModal
                title="Add Event"
                isOpen={newIsOpen}
                onClose={newOnClose}
            />
        </BodyContainer>
    )
}

export default Boast