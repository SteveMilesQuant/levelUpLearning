import { Box, HStack, Link, Stack, Text, Image } from '@chakra-ui/react'
import { BsDot } from 'react-icons/bs'
import GoofyText from './GoofyText'
import facebookLogo from '../assets/Facebook_Logo_Primary.svg'
import instagramLogo from "../assets/Instagram_Glyph_Gradient.svg"

const Footer = () => {
    const goofyFontSize = { base: 16, lg: 28, xl: 40 };
    const fontSize = { base: 12, lg: 16, xl: 24 };
    const iconSize = { base: 6, lg: 10, xl: 14 };
    const paddingX = { base: 2, lg: 6, xl: 10 };
    const paddingY = { base: 0.5, lg: 1, xl: 2 };
    const separatorHeight = { base: 4, lg: 5, xl: 6 };
    const iconSpacing = { base: 1, lg: 3, xl: 5 };

    return (
        <Stack width="full" spacing={0}>
            <Box width="full" bgColor="brand.primary" height={separatorHeight} />
            <HStack justifyContent="space-between" bgColor="white" paddingX={paddingX} paddingY={paddingY}>
                <Stack spacing={0}>
                    <GoofyText fontSize={goofyFontSize} textAlign="left">Contact us</GoofyText>
                    <Text fontFamily="roboto" textColor="brand.primary" fontSize={fontSize} lineHeight={1.2}>(919) 439-0924</Text>
                    <Text fontFamily="roboto" textColor="brand.primary" fontSize={fontSize} lineHeight={1.2}> info@leveluplearningnc.com</Text>
                </Stack>
                <Stack spacing={1}>
                    <GoofyText fontSize={goofyFontSize} textAlign="right">Follow us</GoofyText>
                    <HStack align="end" justify="end" width="full" spacing={iconSpacing}>
                        <Link href="https://www.facebook.com/leveluplearningnc" isExternal>
                            <Image src={facebookLogo} alt="Facebook Logo" width={iconSize} height={iconSize} />
                        </Link>
                        <Link href="https://www.instagram.com/leveluplearning_nc" isExternal>
                            <Image src={instagramLogo} alt="Instagram Logo" width={iconSize} height={iconSize} />
                        </Link>
                    </HStack>
                </Stack>
            </HStack>
            <HStack
                spacing={1}
                width="full"
                justifyContent="center"
                marginY={5}
                bgColor="brand.primary"
                paddingY={paddingY}
            >
                <Link textColor="white" fontSize={fontSize} href="/about">About</Link>
                <BsDot color="white" />
                <Link textColor="white" fontSize={fontSize} href="/privacy">Privacy</Link>
                <BsDot color="white" />
                <Link textColor="white" fontSize={fontSize} href="/data-request">Data requests</Link>
            </HStack>
        </Stack>
    )
}

export default Footer