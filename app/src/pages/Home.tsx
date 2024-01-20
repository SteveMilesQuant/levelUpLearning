import { Stack, Image, Box } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import carouselImage1 from "../assets/c1.svg";
import carouselImage2 from "../assets/c2.svg";
import carouselImage3 from "../assets/c3.svg";
//import carouselImage4 from "../assets/c4.svg";
import carouselImage5 from "../assets/c5.svg";
import carouselImage6 from "../assets/c6.svg";
import carouselImage7 from "../assets/c7.svg";

const Home = () => {
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
    <Stack width="100%" alignItems="center" marginY={5}>
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
    </Stack>
  );
};

export default Home;
