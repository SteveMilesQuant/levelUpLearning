import { FaLevelUpAlt, FaGraduationCap } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdManageAccounts, MdOutlineDesignServices } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { List, ListItem } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { Role } from "../hooks/useRoles";
import LinkIcon from "./LinkIcon";

interface Props {
  roles: Role[];
}

interface SideIcon {
  id: number;
  icon: IconType;
  endpoint: string;
}

const SideIconList = ({ roles }: Props) => {
  const iconsByRole: { [key: string]: SideIcon[] } = {
    GUARDIAN: [
      { id: 1, icon: FaGraduationCap, endpoint: "/students" },
      { id: 2, icon: FaLevelUpAlt, endpoint: "/students" },
    ],
    INSTRUCTOR: [
      { id: 1, icon: GiTeacher, endpoint: "/students" },
      { id: 1, icon: MdOutlineDesignServices, endpoint: "/students" },
    ],
    ADMIN: [
      { id: 1, icon: AiOutlineSchedule, endpoint: "/students" },
      { id: 1, icon: MdManageAccounts, endpoint: "/students" },
    ],
  };

  return (
    <List paddingLeft={3} paddingTop={3}>
      {roles.map((role) =>
        iconsByRole[role.name].map((sideIcon) => (
          <ListItem key={sideIcon.id} padding={3}>
            <LinkIcon icon={sideIcon.icon} endpoint={sideIcon.endpoint} />
          </ListItem>
        ))
      )}
    </List>
  );
};

export default SideIconList;
