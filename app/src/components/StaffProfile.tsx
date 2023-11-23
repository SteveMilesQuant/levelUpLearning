import { Heading, Stack, Image, Text } from "@chakra-ui/react";

interface Props {
  name: string;
  photo: string;
  education: string[];
  experience: string;
  interests: string;
}

const StaffProfile = ({
  name,
  photo,
  education,
  experience,
  interests,
}: Props) => {
  return (
    <Stack spacing={5} alignContent="center" textAlign="center">
      <Heading fontSize="3xl">{name}</Heading>
      <Image src={photo} alt={name + "'s photo"} />
      <Heading fontSize="2xl" textDecor="underline">
        Education
      </Heading>
      {education.map((edu) => (
        <Text>{edu}</Text>
      ))}
      <Heading fontSize="2xl" textDecor="underline">
        Experience
      </Heading>
      <Text>{experience}</Text>
      <Heading fontSize="2xl" textDecor="underline">
        Interests
      </Heading>
      <Text>{interests}</Text>
    </Stack>
  );
};

export default StaffProfile;
