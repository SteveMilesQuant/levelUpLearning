import miller from "../assets/MillerBio.webp";
import miles from "../assets/MilesBio.webp";
import alex from "../assets/AlexBio.webp";
import { Stack, Image, useBreakpointValue, Button, HStack, Text } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import swiperight from "../assets/swipe_right.webp";
import { useState } from "react";

const TeachersPanel = () => {
    const showButtons = useBreakpointValue({ base: false, md: true });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const fontSize = { base: 18, md: 24, lg: 30, xl: 30 };
    const buttonPadding = { base: 6, lg: 8, xl: 8 };

    const teacherImageList = [
        { src: miller, alt: "Megan Miller" },
        { src: miles, alt: "Karen Miles" },
        { src: alex, alt: "Karen Miles" },
    ];

    const handlePrev = () => {
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : prev);
    };

    const handleNext = () => {
        setSelectedIndex((prev) => prev < teacherImageList.length - 1 ? prev + 1 : prev); // Wrap-around logic
    };

    return (
        <Stack align="center" width="full" spacing={0} paddingX={{ base: "10%", md: "20%", lg: "25%", xl: "30%" }} paddingBottom={5}>
            <Carousel
                autoPlay={false}
                infiniteLoop={false}
                // interval={3000}
                showStatus={false}
                showThumbs={false}
                showArrows={false}
                showIndicators={false}
                selectedItem={showButtons && selectedIndex || undefined}
                onChange={showButtons ? (index) => setSelectedIndex(index) : undefined}
            >
                {teacherImageList.map((image, index) => <Image key={index} src={image.src} alt={image.alt} />)}
            </Carousel>
            {!showButtons && <Image src={swiperight} alt="Swipe right to meet everyone" />}
            {showButtons &&
                <HStack width="full" justify="space-around">
                    <Button variant="solid" color="white" padding={buttonPadding} isDisabled={selectedIndex === 0} onClick={handlePrev}>
                        <Text textColor="brand.primary" textAlign="center" fontSize={fontSize}>Prev</Text>
                    </Button>
                    <Button variant="solid" color="white" padding={buttonPadding} isDisabled={selectedIndex === teacherImageList.length - 1} onClick={handleNext}>
                        <Text textColor="brand.primary" textAlign="center" fontSize={fontSize}>Next</Text>
                    </Button>
                </HStack>
            }
        </Stack >
    );
}

export default TeachersPanel