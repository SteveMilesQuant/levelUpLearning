import { Box, Image, HStack } from "@chakra-ui/react";
import { ReactElement } from "react";

interface Props {
    src: string;
    alt: string;
    buttonSet?: ReactElement[];
    marginX?: string;
    height?: any;
}

const EditableImage = ({ src, alt, buttonSet, marginX, height }: Props) => {
    return (
        <Box position="relative">
            <Image
                marginX={marginX}
                src={src}
                alt={alt}
                height={height}
            />
            {buttonSet &&
                <HStack spacing={0.5} position="absolute" zIndex={1} right={0.5} top={0.5} bgColor="white" opacity={0.9} borderRadius={5}>
                    {buttonSet.map((b, i) => <Box key={i}>{b}</Box>)}
                </HStack>
            }
        </Box>
    )
}

export default EditableImage