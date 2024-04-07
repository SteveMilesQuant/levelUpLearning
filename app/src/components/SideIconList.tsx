import {
  FaGraduationCap,
  FaHome,
  FaPhoneAlt,
  FaRegQuestionCircle,
  FaSearch,
} from "react-icons/fa";
import { GiHamburgerMenu, GiTeacher } from "react-icons/gi";
import {
  MdManageAccounts,
  MdOutlineDesignServices,
  MdSettings,
} from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
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
  IoBook,
  IoBookOutline,
  IoClose,
  IoPricetagsOutline,
} from "react-icons/io5";
import { useUser } from "../users";
import { Link as RouterLink } from "react-router-dom";

interface SideIconData {
  role: "PUBLIC" | "GUARDIAN" | "INSTRUCTOR" | "ADMIN";
  icon: ReactElement;
  endpoint: string;
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
      role: "PUBLIC",
      icon: <FaHome size="2em" />,
      endpoint: "/",
      label: "Home",
    },
    {
      role: "PUBLIC",
      icon: <FaSearch size="2em" />,
      endpoint: "/camps",
      label: "Find Camps",
    },
    {
      role: "GUARDIAN",
      icon: <FaGraduationCap size="2em" />,
      endpoint: "/students",
      label: "My Students",
    },
    {
      role: "PUBLIC",
      icon: <GiPartyPopper size="2em" />,
      endpoint: "/events",
      label: "Community Events",
    },
    {
      role: "PUBLIC",
      icon: <IoBookOutline size="2em" />,
      endpoint: "/resources",
      label: "Resources",
    },
    {
      role: "INSTRUCTOR",
      icon: <GiTeacher size="2em" />,
      endpoint: "/teach",
      label: "Teach",
    },
    {
      role: "INSTRUCTOR",
      icon: <MdOutlineDesignServices size="2em" />,
      endpoint: "/programs",
      label: "Design",
    },
    {
      role: "ADMIN",
      icon: <AiOutlineSchedule size="2em" />,
      endpoint: "/schedule",
      label: "Schedule",
    },
    {
      role: "ADMIN",
      icon: <MdManageAccounts size="2em" />,
      endpoint: "/members",
      label: "Members",
    },
    {
      role: "ADMIN",
      icon: <SlNotebook size="2em" />,
      endpoint: "/enrollments",
      label: "Enrollments",
    },
    {
      role: "ADMIN",
      icon: <IoPricetagsOutline size="2em" />,
      endpoint: "/coupons",
      label: "Coupons",
    },
    {
      role: "ADMIN",
      icon: <IoBook size="2em" />,
      endpoint: "/equip",
      label: "Edit resources",
    },
    {
      role: "PUBLIC",
      icon: <FaRegQuestionCircle size="2em" />,
      endpoint: "/about",
      label: "About",
    },
    {
      role: "PUBLIC",
      icon: <FaPhoneAlt size="2em" />,
      endpoint: "/contact",
      label: "Contact",
    },
    {
      role: "GUARDIAN",
      icon: <MdSettings size="2em" />,
      endpoint: "/settings",
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
                    ["PUBLIC", ...(user?.roles || [])].find((r) => x.role == r)
                  )
                  .map((sideIcon) => (
                    <HStack
                      key={sideIcon.id}
                      spacing={3}
                      justify="left"
                      align="center"
                    >
                      <Box onClick={onClose}>
                        <LinkIcon
                          icon={sideIcon.icon}
                          endpoint={sideIcon.endpoint}
                          label={sideIcon.label}
                        />
                      </Box>
                      <Box onClick={onClose}>
                        <LinkBox as={RouterLink} to={sideIcon.endpoint}>
                          <Text color="white">{sideIcon.label}</Text>
                        </LinkBox>
                      </Box>
                    </HStack>
                  ))}
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default SideIconList;
