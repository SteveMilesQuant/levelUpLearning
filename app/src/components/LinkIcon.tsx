import { IconButton, LinkBox } from "@chakra-ui/react";
import { ReactElement } from "react";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  icon: ReactElement;
  endpoint: string;
  label: string;
}

const LinkIcon = ({ icon, endpoint, label }: Props) => {
  return (
    <LinkBox as={RouterLink} to={endpoint}>
      <IconButton
        icon={icon}
        aria-label={label}
        size="1.5em"
        color="white"
        variant="ghost"
      />
    </LinkBox>
  );
};

export default LinkIcon;
