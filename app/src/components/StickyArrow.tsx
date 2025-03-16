import { Image, useBreakpointValue } from "@chakra-ui/react"
import stickyarrow from "../assets/stickyarrow.svg";

const StickyArrow = () => {
    const transformImage = useBreakpointValue({ base: "rotate(-90deg)", xl: "" });
    const imageHeight = useBreakpointValue({ base: "26px", xl: "54px" });
    return (
        <Image position="absolute"
            src={stickyarrow}
            height={imageHeight}
            top={{ base: 6, xl: 12 }}
            right={{ base: -8, xl: -10 }}
            transform={transformImage}
        />
    )
}

export default StickyArrow