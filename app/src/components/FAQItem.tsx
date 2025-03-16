import { Box, Stack, HStack, Text, Image, useDisclosure } from "@chakra-ui/react"
import downarrow from "../assets/downarrow3.svg";

interface Props {
    question: string;
    answer: string;
}

const FAQItem = ({ question, answer }: Props) => {
    const { isOpen, onToggle } = useDisclosure();
    const imageSize = { base: 4, xl: 12 };

    return (
        <>
            <Box><Box borderColor="brand.tertiary" borderWidth={{ base: 0.5, xl: 2 }} marginX={{ base: 2, xl: 5 }} /></Box>
            <Stack fontFamily="Playpen Sans" textColor="brand.primary" spacing={{ base: 2, xl: 4 }}>
                <HStack marginX={{ base: 6, xl: 10 }} justifyContent="space-between">
                    <Box />
                    <Text fontSize={{ base: 18, lg: 30, xl: 38 }} textAlign="center" width="90%">{question}</Text>
                    <Box border={{ base: 1, xl: 3 }} borderStyle="solid" borderColor="brand.tertiary" borderRadius={{ base: 2, xl: 8 }} onClick={onToggle} >
                        <Image src={downarrow} height={imageSize} width={imageSize} />
                    </Box>
                </HStack>
                <Box paddingX={{ base: "40px", xl: "120px" }} hidden={!isOpen}><Text fontSize={{ base: 14, lg: 20, xl: 26 }} >{answer}</Text></Box>
            </Stack>
        </>
    )
}

export default FAQItem