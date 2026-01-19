import { HStack, Stack, Box, useBreakpointValue, AspectRatio, SimpleGrid } from "@chakra-ui/react"
import GoofyText from "./GoofyText"
import MissionItem from "./MissionItem";

const MissionPanel = () => {
    const borderSize = useBreakpointValue({ base: 5, xl: 14 });

    return (
        <Box width="full">
            <SimpleGrid bgColor="white" marginY={{ base: 2, xl: 8 }} paddingX={{ base: 4, xl: 10 }} paddingY={{ base: 5, xl: 8 }} spacing={{ base: 4, xl: 10 }} columns={{ base: 1, md: 2 }}>
                <Box width="100%" marginY={5}>
                    <AspectRatio ratio={16 / 9} >
                        <iframe
                            title="Level Up Learning Introductory Video"
                            src="https://www.youtube.com/embed/3DWlezXyJtY"
                            allowFullScreen
                        />
                    </AspectRatio>
                </Box>
                <Stack position="relative" spacing={{ base: 5, xl: 8 }} >
                    <HStack justifyContent="space-between">
                        <Box borderTop={borderSize} borderBottom={borderSize} borderStyle="dotted" borderColor="brand.primary">
                            <GoofyText fontSize={{ base: 26, xl: 36 }}>Every day we strive to:</GoofyText>
                        </Box>
                    </HStack>
                    <Stack paddingX={{ base: 1, xl: 5 }} spacing={{ base: 3, xl: 5 }}>
                        <MissionItem
                            firstLine="inspire creativity and nurture a passion for reading and writing"
                            secondLine="through immersive activities and supportive instruction" />
                        <MissionItem
                            firstLine="build confidence in every student "
                            secondLine="by meeting them at their individual level and guiding them toward personal growth" />
                        <MissionItem
                            firstLine="foster a lifelong love of learning"
                            secondLine="in a fun, engaging, and creative environment" />
                        <MissionItem
                            firstLine="ensure each camper leaves feeling positive and motivated"
                            secondLine="about their learning journey" />
                    </Stack>
                </Stack >
            </SimpleGrid>
        </Box>
    )
}

export default MissionPanel