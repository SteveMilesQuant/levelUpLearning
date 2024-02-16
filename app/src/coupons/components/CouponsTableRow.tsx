import { Tr, Td, FormControl, Input, Select } from "@chakra-ui/react";
import { Coupon } from "../Coupon";
import { useState } from "react";
import CrudButtonSet from "../../components/CrudButtonSet";
import { useDeleteCoupon } from "../hooks/useCoupons";
import useCouponForm from "../hooks/useCouponForm";
import InputError from "../../components/InputError";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";

interface Props {
  coupon?: Coupon;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const CouponsTableRow = ({ coupon, onCancel, onSuccess }: Props) => {
  const [isEditing, setIsEditing] = useState(!coupon);
  const { register, errors, handleClose, handleSubmit, isValid, control } =
    useCouponForm(coupon);
  const deleteCoupon = useDeleteCoupon();

  const handleDelete = () => {
    if (coupon) deleteCoupon.mutate(coupon.id);
  };

  const handleCancel = () => {
    handleClose();
    if (onCancel) onCancel();
  };

  const handleSuccess = () => {
    handleSubmit();
    if (onSuccess) onSuccess();
  };

  return (
    <Tr>
      <Td>
        <FormControl>
          <InputError
            label={errors.code?.message}
            isOpen={errors.code ? true : false}
          >
            <Input {...register("code")} type="text" isReadOnly={!isEditing} />
          </InputError>
        </FormControl>
      </Td>
      <Td>
        <FormControl>
          <InputError
            label={errors.discount_type?.message}
            isOpen={errors.discount_type ? true : false}
          >
            <Select {...register("discount_type")} disabled={!isEditing}>
              <option value="percent">%</option>
              <option value="dollars">$</option>
            </Select>
          </InputError>
        </FormControl>
      </Td>
      <Td>
        <FormControl>
          <InputError
            label={errors.discount_amount?.message}
            isOpen={errors.discount_amount ? true : false}
          >
            <Input
              {...register("discount_amount")}
              type="number"
              isReadOnly={!isEditing}
            />
          </InputError>
        </FormControl>
      </Td>
      <Td>
        <Controller
          control={control}
          name="y_expiration"
          render={({ field }) => (
            <DatePicker
              onChange={(d) => field.onChange(d)}
              selected={field.value}
              readOnly={!isEditing}
            />
          )}
        />
      </Td>
      <Td>
        <CrudButtonSet
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onDelete={handleDelete}
          confirmationLabel={coupon?.code}
          onCancel={handleCancel}
          onSubmit={handleSuccess}
          isSubmitValid={isValid}
        />
      </Td>
    </Tr>
  );
};

export default CouponsTableRow;
