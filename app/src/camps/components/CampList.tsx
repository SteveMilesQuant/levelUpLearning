import { List } from "@chakra-ui/react";
import CampCard from "./CampCard";
import { Camp, CampsPageContext } from "../Camp";

interface Props {
  camps: Camp[];
  marginBottom?: string | number;
}

const CampList = ({ camps, marginBottom }: Props) => {
  return (
    <List spacing={5} marginBottom={camps.length > 0 ? marginBottom : ""}>
      {camps.map((camp) => (
        <CampCard
          key={camp.id}
          camp={camp}
          campsPageContext={CampsPageContext.camps}
        />
      ))}
    </List>
  );
};

export default CampList;
