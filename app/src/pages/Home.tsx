import { Stack, Image, Box, Button, Text } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import homepage1 from "../assets/homepage1.svg";
import homepage3 from "../assets/homepage3.svg";
import homepage5 from "../assets/homepage5.svg";
import carouselImage1 from "../assets/c1.svg";
import carouselImage2 from "../assets/c2.svg";
import carouselImage3 from "../assets/c3.svg";
//import carouselImage4 from "../assets/c4.svg";
import carouselImage5 from "../assets/c5.svg";
import carouselImage6 from "../assets/c6.svg";
import carouselImage7 from "../assets/c7.svg";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const cards = [
    { id: 0, img: carouselImage1 },
    { id: 1, img: carouselImage2 },
    { id: 2, img: carouselImage3 },
    // { id: 3, img: carouselImage4 },
    { id: 4, img: carouselImage5 },
    { id: 5, img: carouselImage6 },
    { id: 6, img: carouselImage7 },
  ];

  return (
    <Stack width="100%" alignItems="center" spacing={10} marginY={5}>
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
      <Box>
        <Image src={homepage3} />
      </Box>
      <Box width={{ base: "90%", md: "50%" }}>
        <Carousel
          autoPlay={true}
          infiniteLoop={true}
          interval={3000}
          showStatus={false}
          showThumbs={false}
        >
          {cards.map((card) => (
            <Image key={card.id} src={card.img} />
          ))}
        </Carousel>
      </Box>
      <Box>
        <Image src={homepage5} />
      </Box>
    </Stack >
  );
};

export default Home;
