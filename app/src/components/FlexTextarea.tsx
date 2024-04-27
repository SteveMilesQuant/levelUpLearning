import { Textarea } from '@chakra-ui/react'
import ResizeTextarea from "react-textarea-autosize"

interface Props {
    value: string;
}

const FlexTextarea = (props: Props) => {
    return (
        <Textarea
            minH="unset"
            overflow="hidden"
            w="100%"
            resize="none"
            minRows={1}
            as={ResizeTextarea}
            isReadOnly={true}
            {...props}
            padding={3}
        />
    )
}

export default FlexTextarea