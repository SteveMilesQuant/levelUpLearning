import { List, ListItem } from "@chakra-ui/react";
import { Student } from "../../students/Student";
import useCamps from "../hooks/useCamps";
import CampCard from "./CampCard";

interface Props {
  student?: Student;
  marginBottom?: string | number;
}

const CampList = ({ student, marginBottom }: Props) => {
  const { camps, error, isLoading, setError } = useCamps({ student });

  return (
    <List spacing={5} marginBottom={camps.length > 0 ? marginBottom : ""}>
      {camps.map((camp) => (
        <ListItem key={camp.id}>
          <CampCard camp={camp} />
        </ListItem>
      ))}
    </List>
  );
};

export default CampList;
