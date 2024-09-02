import { Box, Button, Stack, Image, Text } from '@chakra-ui/react';
import homepage1 from "../assets/homepage1.svg";
import { useNavigate } from 'react-router-dom';

const HomePageTeaser = () => {
    const navigate = useNavigate();

    return (
        <Box position="relative">
            <Image src={homepage1} />
            <Stack width="100%" alignItems="center" position="absolute" bottom="18%">
                <Button
                    onClick={() => navigate("/camps")}
                    fontSize={{ "base": 12, "md": 20, "lg": 40 }}
                    size="md"
                    bgColor="brand.tertiary"
                    height="fit-content"
                >
                    <Text marginY={{ "base": 1.5, "md": 2, "lg": 3 }} marginX={{ "base": 2, "md": 4, "lg": 12 }} textColor="white">
                        ENROLL NOW
                    </Text>
                </Button>

            </Stack>
        </Box>
    )
}

export default HomePageTeaser