import { Box, Stack, Text, Image, LinkBox } from "@chakra-ui/react";
import { Event } from "../Event"
import { Link as RouterLink } from "react-router-dom";
import EventTitleImage from "./EventTitleImage";
import { useEffect, useState } from "react";
import { ImageFile } from "../../interfaces/Image";
import { Carousel } from "react-responsive-carousel";
import TextButton from "../../components/TextButton";

interface Props {
    event: Event;
}

const EventPublic = ({ event }: Props) => {
    const [titleImage, setTitleImage] = useState<ImageFile | undefined>(undefined);
    const [carouselImages, setCarouselImages] = useState<ImageFile[]>([]);

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

    return (
        <Stack spacing={7} alignItems="center">
            {titleImage &&
                <Box width="100%">
                    <EventTitleImage src={titleImage.url} alt={event.title} />
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
                <Text whiteSpace="pre" lineHeight={1.3}>
                    <strong>{event.intro}</strong>
                </Text>
            </Box>}
            {carouselImages.length > 0 &&
                <Box width={{ base: "90%", md: "50%" }}>
                    <Carousel
                        autoPlay={true}
                        infiniteLoop={true}
                        interval={3000}
                        showStatus={false}
                        showThumbs={false}
                        showArrows={true}
                    >
                        {carouselImages.map(image => <Image src={image.url} key={image.id} />)}
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