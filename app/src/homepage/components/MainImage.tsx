import { Box, Image, LinkBox } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import homeMainImage from "../../assets/MobileMainImage.webp";

const MainImage = () => {
    const imageWidth = { base: "full", lg: "85%", xl: "70%" };
    return (
        <Box width={imageWidth}>
            <LinkBox as={RouterLink} to="/camps">
                <Image src={homeMainImage} alt="Bringing the fun back to learning! Enroll now!" />
            </LinkBox>
        </Box>
    )
}

export default MainImage