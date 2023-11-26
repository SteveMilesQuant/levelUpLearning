import { Heading, SimpleGrid, Stack } from "@chakra-ui/react";
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

  var lastMonth: number | undefined = -1;
  var lastYear: number | undefined = -1;
  const campsPlusDate = camps.map((camp) => ({
    startDate: camp.start_time ? new Date(camp.start_time) : undefined,
    camp: camp,
  })); // already sorted by start_time on server side

  const campList = campsPlusDate.map((item) => {
    const month = item.startDate?.getMonth();
    const year = item.startDate?.getUTCFullYear();
    var heading: string | undefined = undefined;
    if ((!month || !year) && lastMonth && lastYear) {
      heading = "Not yet scheduled";
    } else if (
      lastMonth &&
      lastYear &&
      (month !== lastMonth || year !== lastYear)
    ) {
      heading =
        item.startDate?.toLocaleString(locale, { month: "long" }) + " " + year;
    }
    lastMonth = month;
    lastYear = year;
    return { heading: heading, ...item };
  });

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 2, xl: 2 }} spacing={5}>
      {campList.map((item) => (
        <Stack key={item.camp.id} spacing={5}>
          {item.heading && <Heading fontSize="2xl">{item.heading}</Heading>}
          <CampCard
            camp={item.camp}
            onDelete={
              isReadOnly ? undefined : () => deleteCamp.mutate(item.camp.id)
            }
          />
        </Stack>
      ))}
    </SimpleGrid>
  );
};

export default CampGrid;
