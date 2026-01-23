import {
  Box,
  Card,
  CardBody,
  HStack,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { formatCamp, useCamp } from "../camps";
import { useStudent } from "../students";
import { IoClose } from "react-icons/io5";
import { CouponData } from "../coupons/Coupon";

interface Props {
  camp_id: number;
  student_id: number;
  coupon?: CouponData;
  onDelete: () => void;
}

const CartItemCard = ({ camp_id, student_id, coupon, onDelete }: Props) => {
  const { data: camp } = useCamp(camp_id);
  const { data: student } = useStudent(student_id);

  if (!camp || !student) return null;

  const total_cost = (camp.cost || 0) * 100;
  const disc_cost = camp.coupons_allowed ?
    coupon?.discount_type === "percent" ? total_cost * (100 - coupon.discount_amount) / 100 : total_cost - (coupon?.discount_amount || 0) * 100
    : total_cost;

  const total_dollars = total_cost * 0.01;
  const total_string = Number.isInteger(total_dollars) ? total_dollars.toString() : total_dollars.toFixed(2);

  const disc_dollars = disc_cost * 0.01;
  const disc_string = Number.isInteger(disc_dollars) ? disc_dollars.toString() : disc_dollars.toFixed(2);

  const camp_title = formatCamp(camp);

  return (
    <Card>
      <CardBody>
        <Stack>
          <HStack align="start" justify="space-between">
            <Text>
              Enrollment for {student.name} into {camp_title}
            </Text>
            <Box>
              <IconButton
                icon={<IoClose size="1.5em" />}
                aria-label="Delete cart item"
                size="1.5em"
                variant="ghost"
                onClick={onDelete}
              />
            </Box>
          </HStack>
          <HStack justify="space-between">
            <Box>
              {coupon && camp.coupons_allowed && <Text><strong>Coupon:</strong> {coupon.code}</Text>}
              {coupon && !camp.coupons_allowed && <Text><strong>Coupons not permitted for this camp.</strong></Text>}
            </Box>
            <HStack>
              {total_cost > disc_cost && (
                <Text textColor="red" textDecoration="line-through">
                  ${total_string}
                </Text>
              )}
              <Text >
                ${disc_string}
              </Text>
            </HStack>
          </HStack>
        </Stack>
      </CardBody>
    </Card >
  );
};

export default CartItemCard;
