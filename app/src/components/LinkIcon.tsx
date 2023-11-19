import { IconButton, LinkBox, Tooltip } from "@chakra-ui/react";
import { ReactElement } from "react";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  icon: ReactElement;
  endpoint: string;
  label: string;
  withTooltip?: boolean;
}

const LinkIcon = ({ icon, endpoint, label, withTooltip }: Props) => {
  return (
    <LinkBox as={RouterLink} to={endpoint}>
      <Tooltip
        hasArrow
        label={label}
        bg="brand.secondary"
        textColor="brand.primary"
        placement="right-start"
        openDelay={250}
        isDisabled={!withTooltip}
      >
        <IconButton
          icon={icon}
          aria-label={label}
          size="1.5em"
          color="white"
          variant="ghost"
        />
      </Tooltip>
    </LinkBox>
  );
};

export default LinkIcon;
