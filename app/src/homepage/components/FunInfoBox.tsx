import { Box, ResponsiveValue, Stack } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface Props {
    children?: ReactNode;
    onOpen?: () => void;
    height?: ResponsiveValue<number | string>;
    hidden?: boolean;
}

const FunInfoBox = ({ children, onOpen, height }: Props) => {
    const paddingX = { base: 3, lg: 4, xl: 6 };
    const borderRadius = { base: 20, lg: 40, xl: 60 };
    const textPadding = { base: 2, lg: 3.5, xl: 5 };

    return (
        <Box bgColor="brand.tertiary" paddingX={paddingX} borderRadius={borderRadius} height={height} alignContent="center" alignItems="center" position="relative" paddingY={!height && 5 || undefined}>
            <Stack bgColor="white" borderRadius={borderRadius} padding={textPadding} height={height && "85%"} justifyContent="space-around" onClick={onOpen}>
                {children}
            </Stack>
        </Box>
    )
}

export default FunInfoBox