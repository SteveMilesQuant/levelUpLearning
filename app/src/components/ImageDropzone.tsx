
import { Box, Text } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import DeleteButton from './DeleteButton';


export interface Props {
    onDrop: (files: File[]) => void;
}


const ImageDropzone = ({ onDrop }: Props) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
            'image/heic': [],
            'image/jfif': [],
            'image/svg+xml': [],
        },
        onDrop: onDrop,
    });

    return (
        <Box {...getRootProps()}
            flex={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding={3}
            borderWidth={3}
            borderRadius={5}
            borderColor="brand.hover"
            borderStyle="dashed"
            bgColor="brand.lightGray"
            outline="none"
            transition="border 0.24s ease-in-out"
            cursor="pointer"
            _hover={{
                borderColor: "brand.secondary"
            }}
        >
            <input {...getInputProps()} />
            <Text cursor="pointer">Drag 'n' drop a file here, or click to select files</Text>
        </Box >
    )
}

export default ImageDropzone