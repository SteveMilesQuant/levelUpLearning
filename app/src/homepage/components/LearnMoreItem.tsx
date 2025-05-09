import { Box, HStack, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import FunInfoBox from "./FunInfoBox";

interface Props {
    title: string;
    desc: string;
}

const LearnMoreItem = ({ title, desc }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const boxHeight = { base: 100, md: 125, lg: 150, xl: 150 };

    const fontSizes = [
        { base: 10, md: 24, lg: 28, xl: 28 }, // title of teaser box
        { base: 8, md: 22, lg: 24, xl: 24 }, // learn more "button"
        { base: 28, lg: 40, xl: 50 }, // title of pop up
        { base: 24, lg: 36, xl: 42 }, // body of pop up
    ];

    return (
        <>
            <FunInfoBox height={boxHeight} onOpen={onOpen}>
                <Text textColor="brand.primary" textAlign="center" fontSize={fontSizes[0]} lineHeight={1.2}>{title}</Text>
                <HStack justifyContent="center">
                    <Text textAlign="center" textColor="brand.gradient2" fontSize={fontSizes[1]}>LEARN MORE</Text>
                    <IconButton
                        icon={<FaPlus size="1.2em" />}
                        aria-label="Learn more"
                        size="1.2em"
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
                            <Text fontFamily="kent" textColor="brand.primary" textAlign="center" fontSize={fontSizes[2]} lineHeight={1.2}>{title}</Text>
                            <Text fontFamily="'roboto_c', Roboto, Georgia" textColor="brand.gradient2" textAlign="center" fontSize={fontSizes[3]} lineHeight={1.2}>{desc}</Text>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default LearnMoreItem