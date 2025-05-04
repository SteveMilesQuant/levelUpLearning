import { Box, HStack, Image, LinkBox } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import AuthButton from "./AuthButton";
import SideIconList from "./SideIconList";
import ShoppingCart from "./ShoppingCart";
import mobileLogo from "../assets/MobileLogo.webp";

const NavBarMobile = () => {
    return (
        <>
            <Box
                width="full"
                bgColor="white"
            >
                <HStack
                    justifyContent="space-between"
                    width="100%"
                    padding={2}
                >
                    <HStack spacing={2}>
                        <Box>
                            <SideIconList />
                        </Box>
                        <LinkBox as={RouterLink} to="/">
                            <Image height={12} src={mobileLogo} alt="Level Up Learning Logo" />
                        </LinkBox>
                    </HStack>
                    <HStack spacing={2}>
                        <ShoppingCart />
                        <AuthButton />
                    </HStack>
                </HStack>
            </Box>
            <Box width="full" bgColor="brand.primary" height={2}></Box>
        </>
    );
};

export default NavBarMobile;
