import { Stack, Text, Image, useBreakpointValue } from "@chakra-ui/react"
import { Carousel } from "react-responsive-carousel"
import c1 from "../../assets/campertestimonial1.webp";
import c2 from "../../assets/campertestimonial2.webp";
import c3 from "../../assets/campertestimonial3.webp";
import c4 from "../../assets/campertestimonial4.webp";
import c5 from "../../assets/campertestimonial5.webp";
import c6 from "../../assets/campertestimonial6.webp";
import SectionTitle from "./SectionTitle";

const CamperTestimonials = () => {
    const width = { base: "75%", lg: "75%", xl: "40%" };
    const spacing = { base: 2, lg: 5, xl: 8 };
    const showArrows = useBreakpointValue({ base: false, lg: true, xl: true });
    const imageList = [
        { src: c1, alt: 'Pictured: girls testing a science craft they made. "If school was like this...' },
        { src: c2, alt: '... I would want to go every day!" Pictured: students engaging in written exercises.' },
        { src: c3, alt: 'Pictured: student coloring with vibrant markers. "I liked how it challenged by brain...' },
        { src: c4, alt: '... and made calss and school work fun!" Pictured: girl blowing bubbles in another science craft.' },
        { src: c5, alt: 'Pictured: student planning the arrangement of her craft. "Everything was amazing!"' },
        { src: c6, alt: '"I loved it so much!!!" Picture 1: students jumping and reaching in outdoor activity. Picture 2: Megan guiding a student through his problem solving exercise.' },
    ];

    return (
        <Stack fontFamily="kent" width={width} spacing={spacing} paddingY={spacing}>
            <SectionTitle textLines={["OUR CAMPERS SAY:"]} />
            <Carousel
                autoPlay={false}
                infiniteLoop={false}
                // interval={3000}
                showStatus={false}
                showThumbs={false}
                showArrows={showArrows}
                showIndicators={showArrows}
            >
                {imageList.map((image, index) => <Image key={index} src={image.src} alt={image.alt} />)}
            </Carousel>
        </Stack>
    )
}

export default CamperTestimonials