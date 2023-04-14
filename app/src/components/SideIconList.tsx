import { FaLevelUpAlt, FaGraduationCap } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdManageAccounts, MdOutlineDesignServices } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { Icon, List, ListItem } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { Role } from "../hooks/useRoles";

interface Props {
  roles: Role[];
}

interface SideIcon {
  id: number;
  icon: IconType;
}

const SideIconList = ({ roles }: Props) => {
  const iconsByRole: { [key: string]: SideIcon[] } = {
    GUARDIAN: [
      { id: 1, icon: FaGraduationCap },
      { id: 2, icon: FaLevelUpAlt },
    ],
    INSTRUCTOR: [
      { id: 1, icon: GiTeacher },
      { id: 1, icon: MdOutlineDesignServices },
    ],
    ADMIN: [
      { id: 1, icon: AiOutlineSchedule },
      { id: 1, icon: MdManageAccounts },
    ],
  };

  return (
    <List paddingLeft={3} paddingTop={3}>
      {roles.map((role) =>
        iconsByRole[role.name].map((sideIcon) => (
          <ListItem key={sideIcon.id} padding={3}>
            <Icon as={sideIcon.icon} boxSize="40px" color="blue.300" />
          </ListItem>
        ))
      )}
    </List>
  );
};

export default SideIconList;
