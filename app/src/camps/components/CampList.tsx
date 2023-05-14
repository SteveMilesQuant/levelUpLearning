import { List } from "@chakra-ui/react";
import { CampGetType } from "../hooks/useCamps";
import CampCard from "./CampCard";
import { Camp } from "../Camp";

interface Props {
  camps: Camp[];
  marginBottom?: string | number;
}

const CampList = ({ camps, marginBottom }: Props) => {
  return (
    <List spacing={5} marginBottom={camps.length > 0 ? marginBottom : ""}>
      {camps.map((camp) => (
        <CampCard key={camp.id} camp={camp} campGetType={CampGetType.camps} />
      ))}
    </List>
  );
};

export default CampList;
