import { List, ListItem, Text } from "@chakra-ui/react";
import { Student } from "../services/student-service";
import useCamps from "../hooks/useCamps";
import CampCard from "./CampCard";

interface Props {
  student?: Student;
}

const CampList = ({ student }: Props) => {
  const { camps, error, isLoading, setCamps, setError } = useCamps(student);

  return (
    <List spacing={5}>
      {camps.map((camp) => (
        <ListItem key={camp.id}>
          <CampCard camp={camp} />
        </ListItem>
      ))}
    </List>
  );
};

export default CampList;
