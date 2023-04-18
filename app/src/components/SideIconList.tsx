import { FaGraduationCap, FaSearch } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdManageAccounts, MdOutlineDesignServices } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { Box } from "@chakra-ui/react";
import { Role } from "../hooks/useRoles";
import LinkIcon from "./LinkIcon";
import { ReactElement } from "react";

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
        endpoint: "/camps",
        label: "Find Camps",
      },
    ],
    INSTRUCTOR: [
      {
        id: 3,
        icon: <GiTeacher size="2em" />,
        endpoint: "#",
        label: "Teach Camps",
      },
      {
        id: 4,
        icon: <MdOutlineDesignServices size="2em" />,
        endpoint: "/programs",
        label: "Design Programs",
      },
    ],
    ADMIN: [
      {
        id: 5,
        icon: <AiOutlineSchedule size="2em" />,
        endpoint: "#",
        label: "Schedule Camps",
      },
      {
        id: 6,
        icon: <MdManageAccounts size="2em" />,
        endpoint: "#",
        label: "Manage Members",
      },
    ],
  };

  return (
    <Box paddingX={4} paddingY={2} width="fit-content">
      {roles.map((role) =>
        iconsByRole[role.name].map((sideIcon) => (
          <Box key={sideIcon.id} marginBottom={4} width="fit-content">
            <LinkIcon
              icon={sideIcon.icon}
              endpoint={sideIcon.endpoint}
              label={sideIcon.label}
              withTooltip={true}
            />
          </Box>
        ))
      )}
    </Box>
  );
};

export default SideIconList;
