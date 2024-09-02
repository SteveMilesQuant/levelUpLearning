import { Stack } from "@chakra-ui/react";
import HomePageCarousel from "../components/HomePageCarousel";
import HomePageMission from "../components/HomePageMission";
import HomePageFocus from "../components/HomePageFocus";
import HomePageTeaser from "../components/HomePageTeaser";

const Home = () => {


  return (
    <Stack width="100%" alignItems="center" spacing={10} marginY={5}>
      <HomePageTeaser />
      <HomePageFocus />
      <HomePageCarousel />
      <HomePageMission />
    </Stack >
  );
};

export default Home;
