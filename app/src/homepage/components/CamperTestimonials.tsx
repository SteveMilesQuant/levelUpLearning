import { Stack, Image, Text, HStack, Button, useBreakpointValue } from "@chakra-ui/react"
import { Carousel } from "react-responsive-carousel"
import c1 from "../../assets/campertestimonial1.webp";
import c2 from "../../assets/campertestimonial2.webp";
import c3 from "../../assets/campertestimonial3.webp";
import c4 from "../../assets/campertestimonial4.webp";
import c5 from "../../assets/campertestimonial5.webp";
import c6 from "../../assets/campertestimonial6.webp";
import SectionTitle from "./SectionTitle";
import { useState } from "react";

const CamperTestimonials = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const showButtons = useBreakpointValue({ base: false, md: true });

    const width = { base: "75%", lg: "75%", xl: "40%" };
    const spacing = { base: 2, lg: 5, xl: 8 };
    const fontSize = { base: 18, md: 24, lg: 30, xl: 34 };

    const imageList = [
        { src: c1, alt: 'Pictured: girls testing a science craft they made. "If school was like this...' },
        { src: c2, alt: '... I would want to go every day!" Pictured: students engaging in written exercises.' },
        { src: c3, alt: 'Pictured: student coloring with vibrant markers. "I liked how it challenged by brain...' },
        { src: c4, alt: '... and made calss and school work fun!" Pictured: girl blowing bubbles in another science craft.' },
        { src: c5, alt: 'Pictured: student planning the arrangement of her craft. "Everything was amazing!"' },
        { src: c6, alt: '"I loved it so much!!!" Picture 1: students jumping and reaching in outdoor activity. Picture 2: Megan guiding a student through his problem solving exercise.' },
    ];

    const handlePrev = () => {
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : prev);
    };

    const handleNext = () => {
        setSelectedIndex((prev) => prev < imageList.length - 1 ? prev + 1 : prev); // Wrap-around logic
    };

    return (
        <Stack fontFamily="kent" width={width} spacing={spacing} paddingY={spacing}>
            <SectionTitle textLines={["OUR CAMPERS SAY:"]} />
            {!showButtons &&
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
            }
            {showButtons && <>
                <Carousel
                    selectedItem={selectedIndex}
                    onChange={(index) => setSelectedIndex(index)}
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
                <HStack width="full" justify="space-around">
                    <Button variant="outline" isDisabled={selectedIndex === 0} onClick={handlePrev}>
                        <Text textColor="brand.gradient2" textAlign="center" fontSize={fontSize}>Prev</Text>
                    </Button>
                    <Button variant="outline" isDisabled={selectedIndex === imageList.length - 1} onClick={handleNext}>
                        <Text textColor="brand.gradient2" textAlign="center" fontSize={fontSize}>Next</Text>
                    </Button>
                </HStack>
            </>}
        </Stack>
    )
}

export default CamperTestimonials;