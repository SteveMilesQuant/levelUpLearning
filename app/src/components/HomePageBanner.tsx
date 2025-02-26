import { Box } from "@chakra-ui/react"

const HomePageBanner = () => {
    return (
        <Box
            bgColor="brand.gradient3"
            textAlign="center"
            paddingY={2}
            fontWeight="bold"
            fontFamily="montserrat"
            fontSize={{ base: 16, lg: 34 }}
        >
            *EARLY BIRD PRICING ENDS MARCH 15
        </Box>
    )
}

export default HomePageBanner