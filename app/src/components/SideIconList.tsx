import { FaGraduationCap, FaSearch } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdManageAccounts, MdOutlineDesignServices } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { Icon, List, ListItem } from "@chakra-ui/react";
import { Role } from "../hooks/useRoles";
import LinkIcon from "./LinkIcon";
import { ReactElement, ReactNode } from "react";

interface Props {
  roles: Role[];
}

interface SideIcon {
  id: number;
  icon: ReactElement;
  endpoint: string;
  label: string;
}

const SideIconList = ({ roles }: Props) => {
  const iconsByRole: { [key: string]: SideIcon[] } = {
    GUARDIAN: [
      {
        id: 1,
        icon: <FaGraduationCap size="2em" />,
        endpoint: "/students",
        label: "My Students",
      },
      {
        id: 2,
        icon: <FaSearch size="2em" />,
        endpoint: "/students",
        label: "Find Camps",
      },
    ],
    INSTRUCTOR: [
      {
        id: 3,
        icon: <GiTeacher size="2em" />,
        endpoint: "/students",
        label: "Teach Camps",
      },
      {
        id: 4,
        icon: <MdOutlineDesignServices size="2em" />,
        endpoint: "/students",
        label: "Design Programs",
      },
    ],
    ADMIN: [
      {
        id: 5,
        icon: <AiOutlineSchedule size="2em" />,
        endpoint: "/students",
        label: "Schedule Camps",
      },
      {
        id: 6,
        icon: <MdManageAccounts size="2em" />,
        endpoint: "/students",
        label: "Manage Members",
      },
    ],
  };

  return (
    <List paddingLeft={3} paddingTop={3}>
      {roles.map((role) =>
        iconsByRole[role.name].map((sideIcon) => (
          <ListItem key={sideIcon.id} padding={3}>
            <LinkIcon
              icon={sideIcon.icon}
              endpoint={sideIcon.endpoint}
              label={sideIcon.label}
            />
          </ListItem>
        ))
      )}
    </List>
  );
};

export default SideIconList;
