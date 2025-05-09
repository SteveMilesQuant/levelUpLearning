import miller from "../assets/MillerBio.webp";
import miles from "../assets/MilesBio.webp";
import alex from "../assets/AlexBio.webp";
import { Stack, Image } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import swiperight from "../assets/swipe_right.webp";

const TeachersPanel = () => {
    const teacherImageList = [
        { src: miller, alt: "Megan Miller" },
        { src: miles, alt: "Karen Miles" },
        { src: alex, alt: "Karen Miles" },
    ];

    return (
        <Stack align="center" width="full" spacing={0} paddingX={{ base: "10%", md: "20%", lg: "25%", xl: "30%" }}>
            <Carousel
                autoPlay={false}
                infiniteLoop={false}
                // interval={3000}
                showStatus={false}
                showThumbs={false}
                showArrows={false}
                showIndicators={false}
            >
                {teacherImageList.map((image, index) => <Image key={index} src={image.src} alt={image.alt} />)}
            </Carousel>
            <Image src={swiperight} alt="Swipe right to meet everyone" />
        </Stack >
    );
}

export default TeachersPanel