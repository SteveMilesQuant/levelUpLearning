import { Box, Text, keyframes } from "@chakra-ui/react"

const scroll = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const ScrollBanner = () => {
    const animation = `${scroll} 10s linear infinite`;
    const fontSize = { base: 22, lg: 40, xl: 60 };

    return (
        <Box bgGradient="linear(to-r, brand.tertiary, brand.gradient3)" width="full" overflow="hidden" height={10}>
            {/*<Text animation={animation} textAlign="center" textColor="white" paddingY={1} fontFamily="kent" fontSize={fontSize}>SUMMER CAMPS ENROLLING NOW!</Text>*/}
        </Box>
    )
}

export default ScrollBanner