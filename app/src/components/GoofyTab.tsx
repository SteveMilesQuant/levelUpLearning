import { ReactNode } from "react";
import { Tab, Box } from "@chakra-ui/react"
import GoofyText from "./GoofyText"

interface Props {
    bgColor: string;
    children?: ReactNode;
}

const GoofyTab = ({ bgColor, children }: Props) => {
    return (
        <Tab
            bgColor={bgColor}
            borderRadius={{ base: "5px 5px 0 0", xl: "15px 15px 0 0" }}
            borderBottom="0"
            paddingX={{ base: 1, lg: 2, xl: 3 }}
            paddingY={{ base: 0.5, lg: 1, xl: 2 }}
        // transform={{ base: "rotate(90deg)", xl: "" }}
        >
            <Box bgColor="white" borderRadius={{ base: 3, lg: 6, xl: 10 }} paddingX={{ base: 1, lg: 3, xl: 5 }}>
                <GoofyText fontSize={{ base: 16, md: 18, lg: 24, xl: 28 }}>{children}</GoofyText>
            </Box>
        </Tab >
    )
}

export default GoofyTab