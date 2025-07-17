import { Box, HStack, LinkBox, Image, Text, Stack, useDisclosure, useOutsideClick } from '@chakra-ui/react';
import { Link as RouterLink } from "react-router-dom";
import AuthButton from './AuthButton';
import ShoppingCart from './ShoppingCart';
import desktopLogo from "../assets/DesktopLogo.svg";
import { BsChevronDown } from 'react-icons/bs';
import { useUser } from '../users';
import { AiFillEdit } from 'react-icons/ai';
import LinkIcon from './LinkIcon';
import { useRef } from 'react';

const NavBarDesktop = () => {
    const { data: user } = useUser();
    const { isOpen, onClose, onToggle } = useDisclosure();
    const ref = useRef<HTMLDivElement>(null);
    useOutsideClick({
        ref: ref,
        handler: () => {
            if (isOpen) onClose();
        },
    });

    const fontFamily = "'roboto_c', Roboto, Georgia";
    const fontSize = { base: 32 };
    const iconHeight = { base: 32 };
    const navSpacing = { base: "76px" };

    const isGuardian = user?.roles.includes("GUARDIAN");
    const isInstructor = user?.roles.includes("INSTRUCTOR");
    const isAdmin = user?.roles.includes("ADMIN");

    return (
        <>
            <Box
                width="full"
                bgColor="white"
                position="relative"
            >
                <HStack justify="start" spacing={1} width="full" paddingX={5}>
                    <LinkBox as={RouterLink} to="/">
                        <Image height={iconHeight} src={desktopLogo} alt="Level Up Learning Logo" />
                    </LinkBox>
                    <Stack spacing={12}>
                        <Box></Box>
                        <HStack paddingX={navSpacing} spacing={navSpacing}>
                            <LinkBox as={RouterLink} to="/">
                                <Text fontFamily={fontFamily} fontSize={fontSize}>Home</Text>
                            </LinkBox>
                            <LinkBox as={RouterLink} to="/about">
                                <Text fontFamily={fontFamily} fontSize={fontSize}>About Us</Text>
                            </LinkBox>
                            <HStack spacing={4}>
                                <LinkBox as={RouterLink} to="/camps">
                                    <Text fontFamily={fontFamily} fontSize={fontSize}>Find Camps</Text>
                                </LinkBox>
                                {isAdmin && <LinkIcon
                                    icon={<AiFillEdit size="2em" />}
                                    endpoint="/schedule"
                                    label={"Schedule camps"}
                                    color="brand.primary"
                                />}
                            </HStack>
                            <Box position="relative" ref={ref}>
                                <HStack spacing={3} onClick={onToggle}>
                                    <Text fontFamily={fontFamily} fontSize={fontSize}>More</Text>
                                    <BsChevronDown size={36} />
                                </HStack>
                                {isOpen &&
                                    <Stack position="absolute"
                                        onClick={onClose}
                                        top={12} left={-5}
                                        width={400}
                                        padding={5}
                                        bgColor="white"
                                        borderRadius={20} borderColor="brand.primary" borderWidth={2}
                                        zIndex={1}

                                    >
                                        <HStack width="full" justify="space-between">
                                            <LinkBox as={RouterLink} to="/resources">
                                                <Text fontFamily={fontFamily} fontSize={fontSize}>Resources</Text>
                                            </LinkBox>
                                            {isAdmin && <LinkIcon
                                                icon={<AiFillEdit size="2em" />}
                                                endpoint="/equip"
                                                label={"Edit resources"}
                                                color="brand.primary"
                                            />}
                                        </HStack>
                                        <HStack width="full" justify="space-between">
                                            <LinkBox as={RouterLink} to="/events">
                                                <Text fontFamily={fontFamily} fontSize={fontSize}>Community Events</Text>
                                            </LinkBox>
                                            {isAdmin && <LinkIcon
                                                icon={<AiFillEdit size="2em" />}
                                                endpoint="/boast"
                                                label={"Edit events"}
                                                color="brand.primary"
                                            />}
                                        </HStack>
                                        {isGuardian &&
                                            <>
                                                <LinkBox as={RouterLink} to="/students">
                                                    <Text fontFamily={fontFamily} fontSize={fontSize}>My Students</Text>
                                                </LinkBox>
                                                <HStack width="full" justify="space-between">
                                                    <LinkBox as={RouterLink} to="/settings">
                                                        <Text fontFamily={fontFamily} fontSize={fontSize}>Settings</Text>
                                                    </LinkBox>
                                                    {isAdmin && <LinkIcon
                                                        icon={<AiFillEdit size="2em" />}
                                                        endpoint="/members"
                                                        label={"Edit members"}
                                                        color="brand.primary"
                                                    />}
                                                </HStack>
                                            </>
                                        }
                                        {isInstructor && <>
                                            <LinkBox as={RouterLink} to="/teach">
                                                <Text fontFamily={fontFamily} fontSize={fontSize}>Teach</Text>
                                            </LinkBox>
                                            <LinkBox as={RouterLink} to="/programs">
                                                <Text fontFamily={fontFamily} fontSize={fontSize}>Design</Text>
                                            </LinkBox>
                                        </>}
                                        {isAdmin && <>
                                            <LinkBox as={RouterLink} to="/enrollments">
                                                <Text fontFamily={fontFamily} fontSize={fontSize}>Enrollments</Text>
                                            </LinkBox>
                                            <LinkBox as={RouterLink} to="/coupons">
                                                <Text fontFamily={fontFamily} fontSize={fontSize}>Coupons</Text>
                                            </LinkBox>
                                        </>}
                                    </Stack>
                                }
                            </Box>
                        </HStack>
                    </Stack>
                </HStack >

                <HStack spacing={4} position="absolute" top={5} right={5}>
                    <ShoppingCart />
                    <AuthButton />
                </HStack>
            </Box >
            <Box width="full" bgColor="brand.primary" height={6}></Box>
        </>
    )
}

export default NavBarDesktop