import {
  FaGraduationCap,
  FaHome,
  FaPhoneAlt,
  FaRegQuestionCircle,
  FaSearch,
} from "react-icons/fa";
import { GiHamburgerMenu, GiTeacher } from "react-icons/gi";
import {
  MdOutlineDesignServices,
  MdSettings,
} from "react-icons/md";
import { SlNotebook } from "react-icons/sl";
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
} from "@chakra-ui/react";
import LinkIcon from "./LinkIcon";
import { ReactElement } from "react";
import {
  IoBookOutline,
  IoClose,
  IoPricetagsOutline,
} from "react-icons/io5";
import { useUser } from "../users";
import { Link as RouterLink } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { IoIosPeople } from "react-icons/io";

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
      icon: <FaHome size="2em" />,
      label: "Home",
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
      icon: <FaSearch size="2em" />,
      label: "Find Camps",
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
        role: "PUBLIC",
        endpoint: "/resources",
      },
      editable: {
        role: "ADMIN",
        endpoint: "/equip",
      },
      icon: <IoBookOutline size="2em" />,
      label: "Resources",
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
        endpoint: "/enrollments",
      },
      icon: <SlNotebook size="2em" />,
      label: "Enrollments",
    },
    {
      primary: {
        role: "ADMIN",
        endpoint: "/coupons",
      },
      icon: <IoPricetagsOutline size="2em" />,
      label: "Coupons",
    },
    {
      primary: {
        role: "PUBLIC",
        endpoint: "/about",
      },
      icon: <IoIosPeople size="2em" />,
      label: "About",
    },
    {
      primary: {
        role: "PUBLIC",
        endpoint: "/contact",
      },
      icon: <FaPhoneAlt size="2em" />,
      label: "Contact",
    },
    {
      primary: {
        role: "PUBLIC",
        endpoint: "/faq",
      },
      icon: <FaRegQuestionCircle size="2em" />,
      label: "FAQ",
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
          color="white"
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
