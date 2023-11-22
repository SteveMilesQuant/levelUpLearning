import {
  FaGraduationCap,
  FaHome,
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
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import LinkIcon from "./LinkIcon";
import { ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { useUser } from "../users";

interface SideIcon {
  id: number;
  role: "PUBLIC" | "GUARDIAN" | "INSTRUCTOR" | "ADMIN";
  icon: ReactElement;
  endpoint: string;
  label: string;
}

const SideIconList = () => {
  const { data: user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const allIcons: SideIcon[] = [
    {
      id: 1,
      role: "PUBLIC",
      icon: <FaHome size="2em" />,
      endpoint: "/",
      label: "Home",
    },
    {
      id: 2,
      role: "PUBLIC",
      icon: <FaSearch size="2em" />,
      endpoint: "/camps",
      label: "Find Camps",
    },
    {
      id: 3,
      role: "GUARDIAN",
      icon: <FaGraduationCap size="2em" />,
      endpoint: "/students",
      label: "My Students",
    },

    {
      id: 4,
      role: "INSTRUCTOR",
      icon: <GiTeacher size="2em" />,
      endpoint: "/teach",
      label: "Teach Camps",
    },
    {
      id: 5,
      role: "INSTRUCTOR",
      icon: <MdOutlineDesignServices size="2em" />,
      endpoint: "/programs",
      label: "Design Programs",
    },
    {
      id: 6,
      role: "ADMIN",
      icon: <AiOutlineSchedule size="2em" />,
      endpoint: "/schedule",
      label: "Schedule Camps",
    },
    {
      id: 7,
      role: "ADMIN",
      icon: <MdManageAccounts size="2em" />,
      endpoint: "/members",
      label: "Manage Members",
    },
    {
      id: 8,
      role: "GUARDIAN",
      icon: <MdSettings size="2em" />,
      endpoint: "/settings",
      label: "Profile and Settings",
    },
    {
      id: 9,
      role: "PUBLIC",
      icon: <FaRegQuestionCircle size="2em" />,
      endpoint: "/about",
      label: "About",
    },
  ];

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
            >
              <Stack paddingY={2} spacing={6} width="fit-content">
                <Box key={0} width="fit-content" onClick={onClose}>
                  <IconButton
                    icon={<IoClose size="1.5em" />}
                    aria-label="Navigation"
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
                    <Box
                      key={sideIcon.id}
                      width="fit-content"
                      onClick={onClose}
                    >
                      <LinkIcon
                        icon={sideIcon.icon}
                        endpoint={sideIcon.endpoint}
                        label={sideIcon.label}
                        withTooltip={true}
                      />
                    </Box>
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
