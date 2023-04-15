import { Box, Icon, Link } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  icon: IconType;
  endpoint: string;
}

const LinkIcon = ({ icon, endpoint }: Props) => {
  return (
    <Box
      boxSize="50px"
      borderRadius={10}
      overflow="hidden"
      padding={2}
      _hover={{ bgColor: "gray.200" }}
    >
      <Link as={RouterLink} to={endpoint}>
        <Icon as={icon} color="blue.300" boxSize="100%" />
      </Link>
    </Box>
  );
};

export default LinkIcon;
