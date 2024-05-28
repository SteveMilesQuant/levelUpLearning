import { Box, Image } from '@chakra-ui/react'
import DeleteButton from '../../components/DeleteButton';

interface Props {
    src: string;
    alt: string;
    onDelete?: () => void;
}

const EventTitleImage = ({ src, alt, onDelete }: Props) => {
    return (
        <Box>
            <Image
                marginX="auto"
                src={src}
                alt={alt}
                height={{ base: 9, lg: 20 }}
            />
            {onDelete &&
                <Box position="absolute" zIndex={1} right={1} top={1}>
                    <DeleteButton onConfirm={onDelete}>{alt}</DeleteButton>
                </Box>
            }
        </Box>
    )
}

export default EventTitleImage