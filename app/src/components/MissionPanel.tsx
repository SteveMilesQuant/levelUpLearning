import { HStack, Stack, Box, useBreakpointValue } from "@chakra-ui/react"
import GoofyText from "./GoofyText"

import MissionItem from "./MissionItem";
import StickyArrow from "./StickyArrow";

const MissionPanel = () => {
    const borderSize = useBreakpointValue({ base: 5, xl: 14 });

    return (
        <Box position="relative" marginX={{ base: 1, xl: 20 }} width={{ base: "90vw", md: "80vw", xl: "70vw" }}>
            <Stack bgColor="white" marginY={{ base: 2, xl: 8 }} paddingX={{ base: 4, xl: 10 }} paddingY={{ base: 5, xl: 8 }} spacing={{ base: 5, xl: 8 }} >
                <HStack justifyContent="space-between">
                    <Box borderTop={borderSize} borderBottom={borderSize} borderStyle="dotted" borderColor="brand.primary">
                        <GoofyText fontSize={{ base: 26, xl: 54 }}>Every day we strive to:</GoofyText>
                    </Box>
                </HStack>
                <Stack paddingX={{ base: 1, xl: 5 }} spacing={{ base: 8, xl: 5 }}>
                    <MissionItem
                        firstLine="inspire creativity, encourage self-expression and nurture a passion for reading and writing"
                        secondLine="through immersive activities and supportive instruction" />
                    <MissionItem
                        firstLine="build confidence in every student "
                        secondLine="by meeting them at their individual level and guiding them toward personal growth" />
                    <MissionItem
                        firstLine="foster a lifelong love of learning "
                        secondLine="in a fun, engaging, and creative environment" />
                    <MissionItem
                        firstLine="ensure each camper leaves empowered and enthusiastic "
                        secondLine="about their learning journey." />
                </Stack>

            </Stack >
            <StickyArrow />
        </Box>
    )
}

export default MissionPanel