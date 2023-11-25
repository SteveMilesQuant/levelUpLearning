import { SimpleGrid } from "@chakra-ui/react";
import BodyContainer from "../components/BodyContainer";
import StaffProfile from "../components/StaffProfile";
import megan from "../assets/meganmiller.jpeg";
import karen from "../assets/karenmiles.jpeg";

const About = () => {
  const staffProfiles = [
    {
      key: 1,
      name: "Megan Miller",
      photo: megan,
      education: [
        "Bachelor's Degree in Interdisciplinary Liberal Studies James Madison University",
        "Master's Degree in Elementary Education James Madison University",
      ],
      experience: "13 years teaching 6th grade language arts",
      interests:
        "Mrs. Miller loves to spend time with family and friends, travel, exercise, and explore new trends in fashion and design.",
    },
    {
      key: 2,
      name: "Karen Miles",
      photo: karen,
      education: [
        "Bachelor's Degree in English University of Illinois ",
        "Master's Degree in Middle School Teaching NC State University",
      ],
      experience: "8 years teaching 6th grade language arts ",
      interests:
        "Mrs. Miles loves to travel, learn new hobbies, cook, crochet, and spend time with family and friends.",
    },
  ];

  return (
    <BodyContainer>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 2, xl: 2 }} spacing={50}>
        {staffProfiles.map((profile) => (
          <StaffProfile {...profile} />
        ))}
      </SimpleGrid>
    </BodyContainer>
  );
};

export default About;
