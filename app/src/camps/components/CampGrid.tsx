import { Box, Divider, Heading, Stack } from "@chakra-ui/react";
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
    const startDate =
      camp.dates && camp.dates.length > 0 ? new Date(camp.dates[0]) : undefined;
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
          <Stack spacing={5}>
            {month.camps.map((camp) => (
              <Box key={camp.id} width={{ xl: "50%" }}>
                <CampCard
                  camp={camp}
                  onDelete={
                    isReadOnly ? undefined : () => deleteCamp.mutate(camp.id)
                  }
                />
              </Box>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export default CampGrid;
