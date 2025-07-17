import {
  FaDatabase,
  FaGraduationCap,
} from "react-icons/fa";
import { GiHamburgerMenu, GiTeacher } from "react-icons/gi";
import {
  MdOutlineDesignServices,
  MdSettings,
} from "react-icons/md";
import { GiPartyPopper } from "react-icons/gi";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  useDisclosure,
  Text,
  LinkBox,
  Stack,
  HStack,
  Box,
  Image
} from "@chakra-ui/react";
import LinkIcon from "./LinkIcon";
import { ReactElement } from "react";
import {
  IoClose,
  IoPricetagsOutline,
} from "react-icons/io5";
import { useUser } from "../users";
import { Link as RouterLink } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import lightbulb from "../assets/LightBulb.svg";
import star from "../assets/Star.svg";
import magnifyingGlass from "../assets/MagnifyingGlass.svg";
import levelupbook from "../assets/LevelUpBook.svg";

interface SideIconEndpoint {
  role: "PUBLIC" | "GUARDIAN" | "INSTRUCTOR" | "ADMIN";
  endpoint: string;
}

interface SideIconData {
  primary: SideIconEndpoint;
  editable?: SideIconEndpoint;
  icon: ReactElement;
  label: string;
}

interface SideIcon extends SideIconData {
  id: number;
}

const SideIconList = () => {
  const { data: user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const allIconsNoId: SideIconData[] = [
    {
      primary: {
        role: "PUBLIC",
        endpoint: "/",
      },
      icon: <Image height="2em" src={levelupbook} alt="Book icon" />,
      label: "Home",
    },
    {
      primary: {
        role: "PUBLIC",
        endpoint: "/about",
      },
      icon: <Image height="2em" src={star} alt="Star" />,
      label: "About Us",
    },
    {
      primary: {
        role: "PUBLIC",
        endpoint: "/camps",
      },
      editable: {
        role: "ADMIN",
        endpoint: "/schedule",
      },
      icon: <Image height="2em" src={magnifyingGlass} alt="Magnifying glass" />,
      label: "Find Camps",
    },
    {
      primary: {
        role: "PUBLIC",
        endpoint: "/resources",
      },
      editable: {
        role: "ADMIN",
        endpoint: "/equip",
      },
      icon: <Image height="2em" src={lightbulb} alt="Light bulb" />,
      label: "Resources",
    },
    {
      primary: {
        role: "PUBLIC",
        endpoint: "/events",
      },
      editable: {
        role: "ADMIN",
        endpoint: "/boast",
      },
      icon: <GiPartyPopper size="2em" />,
      label: "Community Events",
    },
    {
      primary: {
        role: "GUARDIAN",
        endpoint: "/students",
      },
      icon: <FaGraduationCap size="2em" />,
      label: "My Students",
    },
    {
      primary: {
        role: "GUARDIAN",
        endpoint: "/settings",
      },
      editable: {
        role: "ADMIN",
        endpoint: "/members",
      },
      icon: <MdSettings size="2em" />,
      label: "Settings",
    },
    {
      primary: {
        role: "INSTRUCTOR",
        endpoint: "/teach",
      },
      icon: <GiTeacher size="2em" />,
      label: "Teach",
    },
    {
      primary: {
        role: "INSTRUCTOR",
        endpoint: "/programs",
      },
      icon: <MdOutlineDesignServices size="2em" />,
      label: "Design",
    },
    {
      primary: {
        role: "ADMIN",
        endpoint: "/admindata",
      },
      icon: <FaDatabase size="2em" />,
      label: "Data",
    },
    {
      primary: {
        role: "ADMIN",
        endpoint: "/coupons",
      },
      icon: <IoPricetagsOutline size="2em" />,
      label: "Coupons",
    },

  ];
  const allIcons: SideIcon[] = allIconsNoId.map((icon, index) => {
    return { ...icon, id: index };
  });

  return (
    <>
      {!isOpen && (
        <IconButton
          icon={<GiHamburgerMenu size="1.5em" />}
          aria-label="Navigation"
          size="md"
          color="brand.primary"
          variant="ghost"
          onClick={onOpen}
        />
      )}
      {isOpen && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="rgba(0,0,0,0)" boxShadow="none">
            <DrawerBody
              bg="brand.primary"
              width="fit-content"
              boxShadow="var(--drawer-box-shadow)"
              padding={3}
            >
              <Stack spacing={3}>
                <Box onClick={onClose}>
                  <IconButton
                    icon={<IoClose size="1.5em" />}
                    aria-label="Close navigation"
                    size="1.5em"
                    color="white"
                    variant="ghost"
                  />
                </Box>

                {allIcons
                  .filter((x) =>
                    ["PUBLIC", ...(user?.roles || [])].find((r) => x.primary.role == r)
                  )
                  .map((sideIcon) => (
                    <HStack key={sideIcon.id} justify="space-between" spacing={3} align="center">
                      <HStack
                        spacing={3}
                        justify="left"
                        align="center"
                      >
                        <Box onClick={onClose}>
                          <LinkIcon
                            icon={sideIcon.icon}
                            endpoint={sideIcon.primary.endpoint}
                            label={sideIcon.label}
                          />
                        </Box>
                        <Box onClick={onClose}>
                          <LinkBox as={RouterLink} to={sideIcon.primary.endpoint}>
                            <Text color="white">{sideIcon.label}</Text>
                          </LinkBox>
                        </Box>
                      </HStack>
                      {sideIcon.editable && user?.roles.includes(sideIcon.editable.role) &&
                        <Box onClick={onClose}>
                          <LinkIcon
                            icon={<AiFillEdit size="2em" />}
                            endpoint={sideIcon.editable.endpoint}
                            label={sideIcon.label + " (edit)"}
                          />
                        </Box>
                      }
                    </HStack>
                  ))}
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer >
      )}
    </>
  );
};

export default SideIconList;
