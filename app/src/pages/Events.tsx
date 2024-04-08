import BodyContainer from "../components/BodyContainer";
import steamtitle from "../assets/steamtitle.svg";
import rebus1 from "../assets/rebus1.svg";
import rebus2 from "../assets/rebus2.svg";
import rebus3 from "../assets/rebus3.svg";
import apextitle from "../assets/apextitle.svg";
import apex1 from "../assets/apex1.svg";
import apex2 from "../assets/apex2.svg";
import apex3 from "../assets/apex3.svg";
import { Box, Divider, Image, LinkBox, Stack, Text } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import { Link as RouterLink } from "react-router-dom";
import TextButton from "../components/TextButton";

const Events = () => {
  return (
    <BodyContainer>
      <Stack spacing={14} alignItems="center" width="100%">
        <Stack spacing={7} alignItems="center">
          <Box width="100%">
            <Image
              marginX="auto"
              src={steamtitle}
              alt={"Steam Event"}
              height={{ base: 9, lg: 20 }}
            />
          </Box>
          <Stack
            width="100%"
            spacing={5}
            paddingY={2}
            fontFamily="montserrat"
            bgColor="brand.secondary"
            textAlign="center"
            fontSize={{ base: 16, md: 18, lg: 20 }}
          >
            <Text>
              <strong>Thanks for joining us for a great event!</strong>
            </Text>
            <Text>
              <strong>
                Check your solutions to the Rebus Puzzles and submit your Rebus
                puzzle creations below:
              </strong>
            </Text>
          </Stack>
          <Box width={{ base: "90%", md: "50%" }}>
            <Carousel
              autoPlay={true}
              infiniteLoop={true}
              interval={3000}
              showStatus={false}
              showThumbs={false}
              showArrows={true}
            >
              <Image src={rebus1} />
              <Image src={rebus2} />
              <Image src={rebus3} />
            </Carousel>
          </Box>
          <LinkBox as={RouterLink} to="https://forms.gle/newtjtEMgMy8nUzD8">
            <TextButton fontSize={{ base: undefined, lg: 20, xl: 22 }}>
              Submit Your Rebus Puzzle Creations Here!
            </TextButton>
          </LinkBox>
        </Stack>
        <Divider
          orientation="horizontal"
          borderColor="brand.secondary"
          borderWidth={7}
        />
        <Stack spacing={7} alignItems="center" width="100%">
          <Box width="100%">
            <Image
              marginX="auto"
              src={apextitle}
              alt={"Apex Night Out"}
              height={{ base: 7, lg: 16 }}
            />
          </Box>
          <Stack
            width="100%"
            spacing={5}
            paddingY={2}
            fontFamily="montserrat"
            bgColor="brand.secondary"
            textAlign="center"
            fontSize={{ base: 16, md: 18, lg: 20 }}
          >
            <Text>
              <strong>Thanks for joining us for a great event!</strong>
            </Text>
            <Text>
              <strong>See you next year!</strong>
            </Text>
          </Stack>
          <Stack
            direction={["column", "row"]}
            width="100%"
            height={{ base: undefined, md: 40, lg: 60, xl: 80 }}
            spacing={5}
            paddingX={5}
            justify="center"
          >
            <Image
              height={["auto", "100%"]}
              width={["100%", "auto"]}
              src={apex1}
              alt={"Apex Night Out: Megan hands out puzzles"}
            />
            <Image
              height={["auto", "100%"]}
              width={["100%", "auto"]}
              src={apex2}
              alt={"Apex Night Out: Karen and Megan wait for visitors"}
            />
            <Image
              height={["auto", "100%"]}
              width={["100%", "auto"]}
              src={apex3}
              alt={"Apex Night Out: Karen and Megan field a family"}
            />
          </Stack>
        </Stack>
      </Stack>
    </BodyContainer>
  );
};

export default Events;
