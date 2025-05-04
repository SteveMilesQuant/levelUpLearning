import { Stack } from "@chakra-ui/react";
import { ScrollBanner, MainImage, LearnMoreGrid, CamperTestimonials, FamilyTestimonials } from "../homepage";


const Home = () => {
  const homePageItems = [
    <ScrollBanner key={0} />,
    <MainImage key={1} />,
    <LearnMoreGrid key={2} />,
    <CamperTestimonials key={3} />,
    <FamilyTestimonials key={4} />,
  ];

  return (
    <Stack width="full" alignItems="center" spacing={0}>
      {homePageItems.map(item => item)}
    </Stack>
  );
};

export default Home;
