import BodyContainer from "../components/BodyContainer";
import apextitle from "../assets/apextitle.svg";
import apex1 from "../assets/apex1.svg";
import apex2 from "../assets/apex2.svg";
import apex3 from "../assets/apex3.svg";
import { Box, Divider, Image, Stack } from "@chakra-ui/react";

const Events = () => {
  return (
    <BodyContainer>
      <Stack spacing={7}>
        <Box width="100%">
          <Image
            marginX="auto"
            src={apextitle}
            alt={"Apex Night Out Title"}
            height={7}
          />
        </Box>
        <Stack
          direction={["column", "row"]}
          width="100%"
          height={[null, 60]}
          spacing={5}
          paddingX={5}
          justify="center"
        >
          <Image
            height={["auto", "100%"]}
            width={["100%", "auto"]}
            src={apex1}
            alt={"Apex Night Out 1"}
          />
          <Image
            height={["auto", "100%"]}
            width={["100%", "auto"]}
            src={apex2}
            alt={"Apex Night Out 2"}
          />
          <Image
            height={["auto", "100%"]}
            width={["100%", "auto"]}
            src={apex3}
            alt={"Apex Night Out 3"}
          />
        </Stack>
        <Divider orientation="horizontal" />
      </Stack>
    </BodyContainer>
  );
};

export default Events;
