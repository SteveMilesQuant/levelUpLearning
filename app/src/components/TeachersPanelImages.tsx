import { HStack, Image } from "@chakra-ui/react"

interface Props {
    imageList: { src: string, alt: string }[];
}

const TeachersPanelImages = ({ imageList }: Props) => {
    return (
        <HStack justifyContent="space-between" marginX={20} width={{ base: "90vw", md: "80vw", xl: "70vw" }}>
            {imageList.map((image, index) => <Image key={index} src={image.src} alt={image.alt} />)}
        </HStack>
    )
}

export default TeachersPanelImages