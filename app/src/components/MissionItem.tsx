import { Image, HStack, Stack, Text } from "@chakra-ui/react";
import checkmark from "../assets/checkmark.svg";

interface Props {
    firstLine: string;
    secondLine: string;
}

const MissionItem = ({ firstLine, secondLine }: Props) => {
    const imageSize = { base: "30px", xl: "60px" };

    return (
        <HStack spacing={{ base: 2, xl: 5 }} align="start">
            <Image height={imageSize} width={imageSize} border={{ base: 2, xl: 6 }} borderStyle="solid" borderColor="brand.tertiary" src={checkmark} />
            <Stack fontFamily="roboto_c, Playpen Sans" fontSize={{ base: 16, md: 18, xl: 20 }} spacing={0} alignSelf="start">
                <Text textColor="brand.tertiary" fontWeight="bold">{firstLine}</Text>
                <Text textColor="brand.primary">{secondLine}</Text>
            </Stack>
        </HStack>
    )
}

export default MissionItem