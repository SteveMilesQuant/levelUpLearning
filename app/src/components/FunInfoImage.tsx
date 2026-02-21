import { Box, Stack, Image } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface Props {
    children?: ReactNode;
    imageUrl?: string;
    imageAlt?: string;
    onOpen?: () => void;
    hidden?: boolean;
}

const FunInfoImage = ({ children, imageUrl, imageAlt, onOpen }: Props) => {
    const paddingX = { base: 3, lg: 4, xl: 6 };
    const paddingY = { base: 2, lg: 3, xl: 4 };
    const childrenAddlMargin = { base: 3, lg: 4, xl: 8 };
    const borderRadius = { base: 20, lg: 40, xl: 60 };
    const borderRadiusChildren = { base: 10, lg: 20, xl: 30 };
    const textPadding = { base: 2, lg: 3, xl: 4 };

    return (
        <Box _hover={{ cursor: onOpen ? "pointer" : undefined }} bgColor="brand.tertiary" paddingX={paddingX} paddingY={paddingY} borderRadius={borderRadius} alignContent="center" alignItems="center" position="relative">
            <Box paddingX={childrenAddlMargin}>
                <Stack bgColor="white" borderRadius={borderRadiusChildren} padding={textPadding} justifyContent="space-around" onClick={onOpen} marginX={childrenAddlMargin}>
                    {children}
                </Stack>
            </Box>
            {imageUrl &&
                <Stack bgColor="white" borderRadius={borderRadius} padding={textPadding} justifyContent="space-around" onClick={onOpen} marginTop={paddingY}>
                    <Image src={imageUrl} alt={imageAlt} borderRadius={borderRadius} />
                </Stack>
            }
        </Box>
    )
}

export default FunInfoImage