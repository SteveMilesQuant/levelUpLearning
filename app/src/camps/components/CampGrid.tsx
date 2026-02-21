import { Box, Divider, Stack } from "@chakra-ui/react";
import { useDeleteCamp } from "../hooks/useCamps";
import CampCard from "./CampCard";
import { Camp } from "../Camp";
import { locale } from "../../constants";
import GoofyText from "../../components/GoofyText";
import { StudentCamp } from "../../students/Student";

interface Props {
  camps: Camp[] | StudentCamp[];
  isReadOnly?: boolean;
  showPastCamps: boolean;
}

const CampGrid = ({ camps, isReadOnly, showPastCamps }: Props) => {
  const deleteCamp = useDeleteCamp();

  const campsFiltered = camps.filter(
    (c) =>
      !c.dates ||
      c.dates.length === 0 ||
      (showPastCamps && new Date(c.dates[0] + "T00:00:00") <= new Date()) ||
      (!showPastCamps && new Date(c.dates[0] + "T00:00:00") > new Date())
  );

  const campsByMonth: {
    [id: string]: { id: string; heading: string; camps: Camp[] };
  } = {};
  campsFiltered.forEach((camp) => {
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
          <GoofyText fontSize={{ base: 34, md: 40, lg: 54 }} textAlign="left">{month.heading}</GoofyText>
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
