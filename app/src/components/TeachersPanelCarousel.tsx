import { Carousel } from "react-responsive-carousel";
import { Box, Image, Stack } from "@chakra-ui/react";
import swiperight from "../assets/swipe_right.webp";

interface Props {
    imageList: { src: string, alt: string }[];
}

export const TeachersPanelCarousel = ({ imageList }: Props) => {
    return (
        <Stack marginRight={10} spacing={0} width={{ base: "90vw", md: "80vw", xl: "70vw" }} align="center">
            <Box paddingX={{ base: 3, md: 10, lg: 20, xl: 20 }}>
                <Carousel
                    autoPlay={false}
                    infiniteLoop={false}
                    // interval={3000}
                    showStatus={false}
                    showThumbs={false}
                    showArrows={false}
                    showIndicators={false}
                >
                    {imageList.map((image, index) => <Image key={index} src={image.src} alt={image.alt} />)}
                </Carousel>
            </Box>
            <Image src={swiperight} alt="Swipe right to meet everyone" width="80%" />
        </Stack>
    )
}
