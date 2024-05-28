import { ReactElement } from 'react';
import EditableImage from '../../components/EditableImage';

interface Props {
    src: string;
    alt: string;
    buttonSet?: ReactElement[];
}

const EventTitleImage = ({ src, alt, buttonSet }: Props) => {
    return (
        <EditableImage src={src} alt={alt} buttonSet={buttonSet} marginX="auto" height={{ base: 9, lg: 20 }} />
    )
}

export default EventTitleImage