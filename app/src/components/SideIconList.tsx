import { FaLevelUpAlt, FaGraduationCap } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdManageAccounts, MdOutlineDesignServices } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { Button, Icon, Link, List, ListItem } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { Role } from "../hooks/useRoles";
import { Link as RouterLink } from "react-router-dom";

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
            <Button boxSize="50px" variant="ghost">
              <Link as={RouterLink} to={sideIcon.endpoint}>
                <Icon as={sideIcon.icon} boxSize="40px" color="blue.300" />
              </Link>
            </Button>
          </ListItem>
        ))
      )}
    </List>
  );
};

export default SideIconList;
