import { HStack, IconButton, SimpleGrid, Stack, Text, useBreakpointValue } from "@chakra-ui/react"
import FunInfoImage from "../components/FunInfoImage"
import { FaPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import BodyContainer from "../components/BodyContainer";
import fullDayImg from "../assets/FullDayCamp.webp";
import halfDayImg from "../assets/HalfDayCamp.webp";
import singleDayImg from "../assets/SingleDayEvent.webp";

const CampsPublic = () => {
    const iconSize = useBreakpointValue({ base: "0.9em", md: "1.2em" });
    const navigate = useNavigate();

    const gridColumns = { base: 1, md: 3, lg: 3 };
    const spacing = { base: 3, lg: 5, xl: 8 };
    const paddingX = { base: 4, xl: 15 };
    const teaserBoxTitleFontSize = { base: 16, md: 18, lg: 20, xl: 30 };
    const teaserBoxLearnMoreFontSize = { base: 14, md: 16, lg: 18, xl: 24 };
    const bodyPadding = { base: 0, md: 4, lg: 4, xl: 10 };

    return (
        <BodyContainer paddingY={bodyPadding}>
            <Stack fontFamily="kent" width="full" justify="space-around" paddingY={spacing} paddingX={{ base: 12, md: 5, lg: 5, xl: 5 }}>
                <SimpleGrid columns={gridColumns} paddingX={paddingX} spacing={spacing}>
                    <FunInfoImage onOpen={() => { navigate("/camps/fullday"); }} imageUrl={fullDayImg}>
                        <Text fontSize={teaserBoxTitleFontSize} textColor="brand.primary" textAlign="center" lineHeight={1.2}>Full Day<br />Summer Camps</Text>
                        <HStack justifyContent="center">
                            <Text fontSize={teaserBoxLearnMoreFontSize} textAlign="center" textColor="brand.gradient2" >View Dates</Text>
                            <IconButton
                                icon={<FaPlus size={iconSize} />}
                                aria-label="Learn more"
                                size={iconSize}
                                color="brand.green"
                                variant="ghost"
                            />
                        </HStack>
                    </FunInfoImage>
                    <FunInfoImage onOpen={() => { navigate("/camps/halfday"); }} imageUrl={halfDayImg}>
                        <Text fontSize={teaserBoxTitleFontSize} textColor="brand.primary" textAlign="center" lineHeight={1.2}>Half Day<br />Summer Camps</Text>
                        <HStack justifyContent="center">
                            <Text fontSize={teaserBoxLearnMoreFontSize} textAlign="center" textColor="brand.gradient2" >View Dates</Text>
                            <IconButton
                                icon={<FaPlus size={iconSize} />}
                                aria-label="Learn more"
                                size={iconSize}
                                color="brand.green"
                                variant="ghost"
                            />
                        </HStack>
                    </FunInfoImage>
                    <FunInfoImage onOpen={() => { navigate("/camps/singleday"); }} imageUrl={singleDayImg}>
                        <Text fontSize={teaserBoxTitleFontSize} textColor="brand.primary" textAlign="center" lineHeight={1.2}>Single Day<br />Events</Text>
                        <HStack justifyContent="center">
                            <Text fontSize={teaserBoxLearnMoreFontSize} textAlign="center" textColor="brand.gradient2" >View Dates</Text>
                            <IconButton
                                icon={<FaPlus size={iconSize} />}
                                aria-label="Learn more"
                                size={iconSize}
                                color="brand.green"
                                variant="ghost"
                            />
                        </HStack>
                    </FunInfoImage>
                </SimpleGrid>
            </Stack >
        </BodyContainer>
    )
}

export default CampsPublic