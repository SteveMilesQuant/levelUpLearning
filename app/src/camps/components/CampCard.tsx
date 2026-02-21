import { Divider, HStack, Heading, LinkOverlay, Show, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Camp, CAMP_CAPACITY_DISPLAY_THRESHOLD } from "../Camp";
import DeleteButton from "../../components/DeleteButton";
import { locale } from "../../constants";
import { useContext } from "react";
import CampsContext, { CampsContextType } from "../campsContext";
import CardContainer from "../../components/CardContainer";
import { useCampInstructors } from "../../users";
import { StudentCamp } from "../../students/Student";
import { dateStrToDate, timeRangeToStr } from "../../utils/date";




interface Props {
  camp: Camp | StudentCamp;
  onDelete?: () => void;
}

const CampCard = ({ camp, onDelete }: Props) => {
  const campsContextType = useContext(CampsContext);
  const {
    data: instructors,
    error: instructorsError,
    isLoading: instructorsAreLoading,
  } = useCampInstructors(camp.id);

  if (instructorsAreLoading) return null;
  if (instructorsError) throw instructorsError;

  const byLine =
    "with " +
    instructors
      ?.map((instructor, index) => {
        if (index === 0) return instructor.full_name;
        if (index === instructors.length - 1) {
          if (instructors.length > 2) return ", and " + instructor.full_name;
          return " and " + instructor.full_name;
        }
        return ", " + instructor.full_name;
      })
      .join("");
  const linkTarget =
    "half_day" in camp && camp.half_day
      ? "/camps/halfday/" + camp.id
      : campsContextType === CampsContextType.schedule
        ? "/schedule/" + camp.id
        : campsContextType === CampsContextType.teach
          ? "/teach/" + camp.id
          : campsContextType === CampsContextType.publicSingleDay
            ? "/camps/singleday/" + camp.id
            : campsContextType === CampsContextType.publicHalfDay
              ? "/camps/halfday/" + camp.id
              : camp.single_day_only
                ? "/camps/singleday/" + camp.id
                : "/camps/fullday/" + camp.id; // CampsContextType.publicFullDay

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
        : datesListStr.join(", ")
      : "TBD";

  const startTime = dateStrToDate(camp.daily_start_time);
  const endTime = dateStrToDate(camp.daily_end_time);
  const startTimePm = dateStrToDate(camp.daily_pm_start_time);
  const endTimeAm = dateStrToDate(camp.daily_am_end_time);
  const timeStr =
    "half_day" in camp && camp.half_day
      ? camp.half_day === "AM"
        ? timeRangeToStr(startTime, endTimeAm)
        : timeRangeToStr(startTimePm, endTime)
      :
      campsContextType === CampsContextType.publicHalfDay
        ? timeRangeToStr(startTime, endTimeAm) + ", " + timeRangeToStr(startTimePm, endTime)
        : timeRangeToStr(startTime, endTime);
  const timeStrAddendum =
    "half_day" in camp && camp.half_day
      ? camp.half_day === "AM"
        ? "(AM only)"
        : "(PM only)"
      : undefined;

  const currentCapacity = (camp.capacity || 0) - (camp.current_enrollment || 0);
  const capacityString = currentCapacity <= 0
    ? "All full!"
    : currentCapacity === 1
      ? currentCapacity + " spot left!"
      : currentCapacity <= CAMP_CAPACITY_DISPLAY_THRESHOLD
        ? currentCapacity + " spots left!"
        : undefined;

  return (
    <CardContainer>
      <HStack justifyContent="space-between" marginTop={1}>
        <LinkOverlay as={RouterLink} to={linkTarget}>
          <HStack alignItems="end">
            <Heading fontSize="2xl">{camp.program.title}</Heading>
            <Text>{byLine}</Text>
          </HStack>
        </LinkOverlay>
        {onDelete && (
          <DeleteButton onConfirm={onDelete}>
            {camp.program.title + " " + byLine}
          </DeleteButton>
        )}
        {!onDelete && capacityString &&
          <Text size="xl" fontWeight="bold" fontFamily="verdana" textColor="brand.tertiary">{capacityString}</Text>
        }
      </HStack>

      <Divider orientation="horizontal" marginTop={2} />
      <Stack spacing={1} marginTop={2}>
        {camp.camp_type && camp.camp_type.length > 0 &&
          <Show below="sm">
            <Text size="xl" fontWeight="bold" fontFamily="verdana" textColor="brand.tertiary">{camp.camp_type}</Text>
          </Show>
        }
        <HStack justifyContent="space-between">
          {camp.camp_type && camp.camp_type.length > 0 &&
            <Show above="sm">
              <Text size="xl" fontWeight="bold" fontFamily="verdana" textColor="brand.tertiary">{camp.camp_type}</Text>
            </Show>
          }
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
            {timeStrAddendum && <strong> {timeStrAddendum}</strong>}
          </Text>
        </HStack>
      </Stack>
    </CardContainer>
  );
};

export default CampCard;
