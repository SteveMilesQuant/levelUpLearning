import { HStack, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, ResponsiveValue, Stack, Text, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import FunInfoBox from "./FunInfoBox";

interface Props {
    title: string;
    desc: string;
    teaserBoxTitleFontSize: ResponsiveValue<string | number>;
    teaserBoxLearnMoreFontSize: ResponsiveValue<string | number>;
    teaserBoxHeight: ResponsiveValue<string | number>;
}

const LearnMoreItem = ({ title, desc, teaserBoxTitleFontSize, teaserBoxLearnMoreFontSize, teaserBoxHeight }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const iconSize = useBreakpointValue({ base: "0.9em", md: "1.2em" });

    const fontSizes = [
        { base: 28, lg: 40, xl: 50 }, // title of pop up
        { base: 24, lg: 36, xl: 42 }, // body of pop up
    ];

    return (
        <>
            <FunInfoBox height={teaserBoxHeight} onOpen={onOpen}>
                <Text textColor="brand.primary" textAlign="center" fontSize={teaserBoxTitleFontSize} lineHeight={1.2}>{title}</Text>
                <HStack justifyContent="center">
                    <Text textAlign="center" textColor="brand.gradient2" fontSize={teaserBoxLearnMoreFontSize}>LEARN MORE</Text>
                    <IconButton
                        icon={<FaPlus size={iconSize} />}
                        aria-label="Learn more"
                        size={iconSize}
                        color="brand.green"
                        variant="ghost"
                    />
                </HStack>
            </FunInfoBox>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="4xl"
            >
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px)'
                />
                <ModalContent bgColor="brand.tertiary" borderRadius={20} margin={10} paddingY={3}>
                    <ModalCloseButton right={8} top={6} />
                    <ModalBody bgColor="brand.tertiary" borderRadius={20}>
                        <Stack bgColor="white" borderRadius={20} padding={8} justifyContent="space-around">
                            <Text fontFamily="kent" textColor="brand.primary" textAlign="center" fontSize={fontSizes[0]} lineHeight={1.2}>{title}</Text>
                            <Text fontFamily="'roboto_c', Roboto, Georgia" textColor="brand.gradient2" textAlign="center" fontSize={fontSizes[1]} lineHeight={1.2}>{desc}</Text>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default LearnMoreItem