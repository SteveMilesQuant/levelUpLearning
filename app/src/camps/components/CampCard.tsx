import { Divider, HStack, Heading, LinkOverlay, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Camp } from "../Camp";
import DeleteButton from "../../components/DeleteButton";
import { locale } from "../../constants";
import { useContext } from "react";
import CampsContext, { CampsContextType } from "../campsContext";
import CardContainer from "../../components/CardContainer";
import { useCampInstructors } from "../../users";

interface Props {
  camp: Camp;
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
    campsContextType === CampsContextType.schedule
      ? "/schedule/" + camp.id
      : campsContextType === CampsContextType.teach
      ? "/teach/" + camp.id
      : "/camps/" + camp.id;

  const datesList = camp.dates?.map((date_str) => new Date(date_str));
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

  return (
    <CardContainer>
      <HStack justifyContent="space-between">
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
      </HStack>

      <Divider orientation="horizontal" marginTop={2} />
      <HStack marginTop={2} justifyContent="space-between">
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
      </HStack>
    </CardContainer>
  );
};

export default CampCard;
