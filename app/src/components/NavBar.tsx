import { Box, HStack, Image, Stack, Text } from "@chakra-ui/react";
import headerImage from "../assets/fullLogo.svg";
import AuthButton from "./AuthButton";
import SideIconList from "./SideIconList";
import ShoppingCart from "./ShoppingCart";

const NavBar = () => {
  return (
    <>
      <Box
        width="100%"
        bgGradient="linear(to-b, brand.primary, brand.gradient2, brand.gradient3)"
      >
        <HStack
          position="absolute"
          justifyContent="space-between"
          width="100%"
          padding={2}
        >
          <Box>
            <SideIconList />
          </Box>
          <HStack spacing={3}>
            <ShoppingCart />
            <AuthButton />
          </HStack>
        </HStack>
        <Image
          width={{ base: "160px", lg: "300px" }}
          marginX="auto"
          paddingY={2}
          objectFit="cover"
          src={headerImage}
          alt="Level Up Learning Icon"
        />
      </Box>
      <Stack
        bgColor="brand.primary"
        width="100%"
        spacing={-1}
        paddingY={1}
        fontWeight="bold"
        fontFamily="montserrat"
        fontSize={{ base: 11, lg: 16 }}
      >
        <Text textAlign="center" textColor="white">
          LITERACY CAMPS & CLINICS
        </Text>
        <Text textAlign="center" textColor="white">
          BROUGHT TO YOU BY LOCAL EDUCATORS
        </Text>
      </Stack>
    </>
  );
};

export default NavBar;
