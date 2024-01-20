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
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  useDisclosure,
  Text,
  Grid,
  GridItem,
  LinkBox,
} from "@chakra-ui/react";
import LinkIcon from "./LinkIcon";
import { Fragment, ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { useUser } from "../users";
import { Link as RouterLink } from "react-router-dom";

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
      label: "Teach",
    },
    {
      id: 5,
      role: "INSTRUCTOR",
      icon: <MdOutlineDesignServices size="2em" />,
      endpoint: "/programs",
      label: "Design",
    },
    {
      id: 6,
      role: "ADMIN",
      icon: <AiOutlineSchedule size="2em" />,
      endpoint: "/schedule",
      label: "Schedule",
    },
    {
      id: 7,
      role: "ADMIN",
      icon: <MdManageAccounts size="2em" />,
      endpoint: "/members",
      label: "Members",
    },

    {
      id: 8,
      role: "PUBLIC",
      icon: <FaRegQuestionCircle size="2em" />,
      endpoint: "/about",
      label: "About",
    },
    {
      id: 9,
      role: "PUBLIC",
      icon: <FaPhoneAlt size="2em" />,
      endpoint: "/contact",
      label: "Contact",
    },
    {
      id: 10,
      role: "GUARDIAN",
      icon: <MdSettings size="2em" />,
      endpoint: "/settings",
      label: "Settings",
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
              bg="brand.100"
              width="fit-content"
              boxShadow="var(--drawer-box-shadow)"
              padding={3}
            >
              <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                <GridItem onClick={onClose}>
                  <IconButton
                    icon={<IoClose size="1.5em" />}
                    aria-label="Navigation"
                    size="1.5em"
                    color="white"
                    variant="ghost"
                  />
                </GridItem>
                <GridItem colSpan={2}></GridItem>
                {allIcons
                  .filter((x) =>
                    ["PUBLIC", ...(user?.roles || [])].find((r) => x.role == r)
                  )
                  .map((sideIcon) => (
                    <Fragment key={sideIcon.id}>
                      <GridItem onClick={onClose}>
                        <LinkIcon
                          icon={sideIcon.icon}
                          endpoint={sideIcon.endpoint}
                          label={sideIcon.label}
                        />
                      </GridItem>
                      <GridItem marginY="auto" colSpan={2} onClick={onClose}>
                        <LinkBox as={RouterLink} to={sideIcon.endpoint}>
                          <Text color="white">{sideIcon.label}</Text>
                        </LinkBox>
                      </GridItem>
                    </Fragment>
                  ))}
              </Grid>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default SideIconList;
