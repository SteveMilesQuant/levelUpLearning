import { List, ListItem } from "@chakra-ui/react";
import { Student } from "../../students";
import useCamps from "../hooks/useCamps";
import CampCard from "./CampCard";

interface Props {
  student?: Student;
  marginBottom?: string | number;
}

const CampList = ({ student, marginBottom }: Props) => {
  const { data: camps, isLoading, error } = useCamps(false, student?.id);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <List spacing={5} marginBottom={camps.length > 0 ? marginBottom : ""}>
      {camps.map((camp) => (
        <CampCard key={camp.id} camp={camp} />
      ))}
    </List>
  );
};

export default CampList;
