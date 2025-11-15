import { Box, Stack, Text, Image, LinkBox } from "@chakra-ui/react";
import { Event } from "../Event"
import { Link as RouterLink } from "react-router-dom";
import EventTitleImage from "./EventTitleImage";
import { Carousel } from "react-responsive-carousel";
import TextButton from "../../components/TextButton";

interface Props {
    event: Event;
}

const EventPublic = ({ event }: Props) => {

    return (
        <Stack spacing={7} alignItems="center">
            {event.title_image && event.title_image.url &&
                <Box width="100%">
                    <EventTitleImage src={event.title_image.url} alt={event.title} />
                </Box>
            }
            {event.intro && <Box
                width="100%"
                paddingY={2}
                fontFamily="montserrat"
                bgColor="brand.secondary"
                textAlign="center"
                fontSize={{ base: 16, md: 18, lg: 20 }}
            >
                <Text whiteSpace="pre-wrap" lineHeight={1.3}>
                    <strong>{event.intro}</strong>
                </Text>
            </Box>}
            {event.carousel_images && event.carousel_images.length > 0 &&
                <Box width={{ base: "90%", md: "50%" }}>
                    <Carousel
                        autoPlay={true}
                        infiniteLoop={true}
                        interval={3000}
                        showStatus={false}
                        showThumbs={false}
                        showArrows={true}
                    >
                        {event.carousel_images.map(image => <Image src={image.url} key={image.id} />)}
                    </Carousel>
                </Box>
            }
            {event.link_url && event.link_text &&
                <LinkBox as={RouterLink} to={event.link_url}>
                    <TextButton fontSize={{ base: undefined, lg: 20, xl: 22 }}>
                        {event.link_text}
                    </TextButton>
                </LinkBox>
            }
        </Stack>
    )
}

export default EventPublic