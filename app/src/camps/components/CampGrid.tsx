import { Divider, Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import { useDeleteCamp } from "../hooks/useCamps";
import CampCard from "./CampCard";
import { Camp } from "../Camp";
import { locale } from "../../constants";

interface Props {
  camps: Camp[];
  isReadOnly?: boolean;
}

const CampGrid = ({ camps, isReadOnly }: Props) => {
  const deleteCamp = useDeleteCamp();

  const campsByMonth: {
    [id: string]: { id: string; heading: string; camps: Camp[] };
  } = {};
  camps.forEach((camp) => {
    const startDate = camp.start_time ? new Date(camp.start_time) : undefined;
    const month = startDate?.getMonth();
    const year = startDate?.getUTCFullYear();
    const key: string = month + "_" + year;
    if (!campsByMonth[key])
      campsByMonth[key] = {
        id: key,
        heading: startDate
          ? startDate.toLocaleString(locale, { month: "long" }) + " " + year
          : "Not yet scheduled",
        camps: [camp],
      };
    else campsByMonth[key].camps.push(camp);
  });

  return (
    <Stack spacing={5}>
      {Object.values(campsByMonth).map((month, month_idx) => (
        <Stack spacing={5} key={month.id}>
          {month_idx > 0 && <Divider />}
          <Heading fontSize="2xl">{month.heading}</Heading>
          <SimpleGrid columns={{ sm: 1, md: 2, lg: 2, xl: 2 }} spacing={5}>
            {month.camps.map((camp) => (
              <CampCard
                key={camp.id}
                camp={camp}
                onDelete={
                  isReadOnly ? undefined : () => deleteCamp.mutate(camp.id)
                }
              />
            ))}
          </SimpleGrid>
        </Stack>
      ))}
    </Stack>
  );
};

export default CampGrid;
