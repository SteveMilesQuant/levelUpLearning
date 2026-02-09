import { Stack, Text } from "@chakra-ui/react";
import { Camp } from "../Camp";
import { locale } from "../../constants";
import FlexTextarea from "../../components/FlexTextarea";
import { useContext } from "react";
import CampsContext, { CampsContextType } from "../campsContext";

interface Props {
  camp?: Camp;
}

const CampTabPublic = ({ camp }: Props) => {
  const campsContextType = useContext(CampsContext);

  if (!camp) return null;

  const datesList = camp.dates?.map(
    (date_str) => new Date(date_str + "T00:00:00")
  );
  let useDateRange = camp.dates !== undefined && camp.dates.length > 1;
  let lastDate: Date | undefined = undefined;
  datesList?.forEach((date: Date) => {
    const diff = lastDate
      ? Math.abs(date.getTime() - lastDate.getTime())
      : undefined;
    const diffDays = diff ? Math.ceil(diff / (1000 * 3600 * 24)) : 1;
    if (diffDays !== 1) useDateRange = false;
    lastDate = date;
  });
  const datesListStr = datesList?.map((date) =>
    date.toLocaleDateString(locale, {
      dateStyle: "short",
    })
  );
  const dateStr =
    datesListStr && datesListStr.length > 0
      ? useDateRange
        ? datesListStr[0] + " to " + datesListStr[datesListStr.length - 1]
        : datesListStr.join(" ")
      : "TBD";

  const startTime = camp.daily_start_time
    ? new Date("2023-01-01T" + camp.daily_start_time)
    : null;
  const endTime = camp.daily_end_time
    ? new Date("2023-01-01T" + camp.daily_end_time)
    : null;
  const timeStr =
    startTime && endTime
      ? startTime.toLocaleString(locale, {
        timeStyle: "short",
      }) +
      " to " +
      endTime.toLocaleString(locale, {
        timeStyle: "short",
      })
      : "TBD";

  const camp_cost = (campsContextType == CampsContextType.publicHalfDay && camp.enroll_half_day_allowed ? camp.half_day_cost : camp.cost) || 0;

  return (
    <Stack spacing={5}>
      <Text>
        <strong>Grades: </strong>
        {camp.program.grade_range[0] + " to " + camp.program.grade_range[1]}
      </Text>
      <Text>
        <strong>
          {datesListStr && datesListStr.length === 1 ? "Date: " : "Dates: "}
        </strong>
        {dateStr}
      </Text>
      <Text>
        <strong>Time: </strong>
        {timeStr}
      </Text>
      <Text>
        <strong>Location: </strong>
        {camp.location || "TBD"}
      </Text>
      {!camp.enrollment_disabled && (
        <Text>
          <strong>Cost: </strong>
          {camp_cost > 0.0 ? "$" + camp_cost : "Free"}
        </Text>
      )}
      <FlexTextarea value={camp.program.description} />
    </Stack>
  );
};

export default CampTabPublic;
