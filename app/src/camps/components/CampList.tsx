import { List } from "@chakra-ui/react";
import useCamps, { CampGetType } from "../hooks/useCamps";
import CampCard from "./CampCard";

interface Props {
  studentId: number;
  marginBottom?: string | number;
}

const CampList = ({ studentId, marginBottom }: Props) => {
  const campGetType = CampGetType.camps;
  const { data: camps, isLoading, error } = useCamps(campGetType, studentId);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <List spacing={5} marginBottom={camps.length > 0 ? marginBottom : ""}>
      {camps.map((camp) => (
        <CampCard key={camp.id} camp={camp} campGetType={campGetType} />
      ))}
    </List>
  );
};

export default CampList;
