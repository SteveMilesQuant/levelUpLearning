import {
  Box,
  Card,
  CardBody,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useCamp } from "../camps";
import { useStudent } from "../students";
import { locale } from "../constants";
import { IoClose } from "react-icons/io5";

interface Props {
  camp_id: number;
  student_id: number;
  onDelete: () => void;
}

const CartItemCard = ({ camp_id, student_id, onDelete }: Props) => {
  const { data: camp } = useCamp(camp_id);
  const { data: student } = useStudent(student_id);

  if (!camp || !student) return null;

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

  return (
    <Card>
      <CardBody textColor="brand.100">
        <HStack justifyContent="space-between">
          <Text>
            Enrollment for {student.name} into {camp.program.title} on {dateStr}
          </Text>
          <Box padding={5}></Box>
        </HStack>
        <Text position="absolute" bottom={3} right={3}>
          ${camp.cost}
        </Text>
        <IconButton
          position="absolute"
          icon={<IoClose size="1.5em" />}
          aria-label="Delete cart item"
          size="1.5em"
          variant="ghost"
          top={1}
          right={1}
          onClick={onDelete}
        />
      </CardBody>
    </Card>
  );
};

export default CartItemCard;
