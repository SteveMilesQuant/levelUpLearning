import { Stack, Text } from '@chakra-ui/react';

interface Props {
    textLines?: string[];
}

const SectionTitle = ({ textLines }: Props) => {
    const fontSize = { base: 20, md: 28, lg: 36, xl: 48 };
    return (
        <Stack spacing={0} fontFamily="kent" fontSize={fontSize}>
            {textLines?.map((text, index) => <Text key={index} textColor="brand.gradient2" textAlign="center">{text}</Text>)}
        </Stack>
    )
}

export default SectionTitle