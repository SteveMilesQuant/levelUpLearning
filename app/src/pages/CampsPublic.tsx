import { HStack, IconButton, SimpleGrid, Stack, Text, useBreakpointValue } from "@chakra-ui/react"
import FunInfoBox from "../homepage/components/FunInfoBox"
import { FaPlus } from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import BodyContainer from "../components/BodyContainer";

const CampsPublic = () => {
    const iconSize = useBreakpointValue({ base: "0.9em", md: "1.2em" });
    const navigate = useNavigate();

    const gridColumns = { base: 1, lg: 3 };
    const spacing = { base: 2, lg: 5, xl: 8 };
    const paddingX = { base: 4, xl: 15 };
    const teaserBoxTitleFontSize = { base: 14, md: 24, lg: 28, xl: 28 };
    const teaserBoxLearnMoreFontSize = { base: 12, md: 22, lg: 24, xl: 24 };
    const teaserBoxHeight = { base: 100, md: 125, lg: 150, xl: 200 };

    return (
        <BodyContainer>
            <Stack fontFamily="kent" width="full" justify="space-around" paddingY={spacing} paddingX={{ base: 0, xl: 5 }}>
                <SimpleGrid columns={gridColumns} paddingX={paddingX} spacing={spacing}>
                    <FunInfoBox height={teaserBoxHeight} onOpen={() => { navigate("/camps/fullday"); }}>
                        <Text fontSize={teaserBoxTitleFontSize} textColor="brand.primary" textAlign="center" lineHeight={1.2}>Full Day Summer Camps</Text>
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
                    </FunInfoBox>
                    <FunInfoBox height={teaserBoxHeight} onOpen={() => { navigate("/camps/halfday"); }}>
                        <Text fontSize={teaserBoxTitleFontSize} textColor="brand.primary" textAlign="center" lineHeight={1.2}>Half Day Summer Camps</Text>
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
                    </FunInfoBox>
                    <FunInfoBox height={teaserBoxHeight} onOpen={() => { navigate("/camps/singleday"); }}>
                        <Text fontSize={teaserBoxTitleFontSize} textColor="brand.primary" textAlign="center" lineHeight={1.2}>Single Day Events</Text>
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
                    </FunInfoBox>
                </SimpleGrid>
            </Stack >
        </BodyContainer>
    )
}

export default CampsPublic