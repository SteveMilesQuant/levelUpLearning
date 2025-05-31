import { Tr, Td, FormControl, Input, Text, Select } from "@chakra-ui/react";
import { Select as ChakraReactSelect } from "chakra-react-select"; // or use react-select
import { Coupon } from "../Coupon";
import { useState } from "react";
import CrudButtonSet from "../../components/CrudButtonSet";
import { useDeleteCoupon } from "../hooks/useCoupons";
import useCouponForm from "../hooks/useCouponForm";
import InputError from "../../components/InputError";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import { CampQuery, useCamps } from "../../camps";
import { CSSObjectWithLabel } from "react-select";

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

  const campQuery = {} as CampQuery;
  campQuery["is_published"] = true
  const { data: camps } = useCamps(campQuery, false);

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
        <Text>{coupon?.used_count || 0}</Text>
      </Td>
      <Td>
        <FormControl>
          <InputError
            label={errors.max_count?.message}
            isOpen={errors.max_count ? true : false}
          >
            <Input
              {...register("max_count")}
              type="max_count"
              isReadOnly={!isEditing}
            />
          </InputError>
        </FormControl>
      </Td>
      <Td>
        <Controller
          control={control}
          name="camp_ids"
          render={({ field }) => (
            <InputError
              label={errors.camp_ids?.message}
              isOpen={!!errors.camp_ids}
            >
              <ChakraReactSelect
                isMulti
                isDisabled={!isEditing}
                placeholder="Select camp(s)"
                options={camps
                  ?.filter(c => c.dates && new Date(c.dates[0] + "T00:00:00") > new Date())
                  .map(camp => ({
                    label: `#${camp.id}: ${camp.program.title}`,
                    value: camp.id,
                  }))}
                value={
                  field.value && camps
                    ? camps
                      .filter(c => (field.value ?? []).includes(c.id))
                      .map(camp => ({
                        label: `#${camp.id}: ${camp.program.title}`,
                        value: camp.id,
                      }))
                    : []
                }
                onChange={(selected: { label: string; value: number }[]) => field.onChange(selected.map(opt => opt.value))}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base: CSSObjectWithLabel) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </InputError>
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
    </Tr >
  );
};

export default CouponsTableRow;
