import { List, ListItem } from "@chakra-ui/react";
import { Student } from "../services/student-service";
import useCamps from "../hooks/useCamps";

interface Props {
  student: Student; // TODO: pass student as query param to camps
}

const CampList = ({ student }: Props) => {
  const { camps, error, isLoading, setCamps, setError } = useCamps();

  return (
    <List spacing={5}>
      {camps.map((camp) => (
        <ListItem key={camp.id}>{camp.program.title}</ListItem>
      ))}
    </List>
  );
};

export default CampList;
