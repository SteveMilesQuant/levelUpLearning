import {
    Badge,
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import ActionButton from "../../components/ActionButton";
import DeleteButton from "../../components/DeleteButton";
import InputError from "../../components/InputError";
import { formatPhone } from "../../utils/phone";
import { UserPickupFormResponse } from "../PickupPersonsTypes";
import { useUpdatePickupPersons } from "../hooks/usePickupPersons";

const schema = z.object({
    pickup_persons: z
        .array(
            z.object({
                name: z.string().min(1, { message: "Name is required." }),
                phone: z.string().min(1, { message: "Phone is required." }),
            })
        )
        .min(1, { message: "At least one pickup person is required." }),
});

type FormData = z.infer<typeof schema>;

const isCurrentYear = (pickupForm?: UserPickupFormResponse): boolean => {
    if (!pickupForm?.updated_at) return false;
    const updatedDate = new Date(pickupForm.updated_at);
    const jan1 = new Date(new Date().getFullYear(), 0, 1);
    return updatedDate >= jan1;
};

const getDefaultPersons = (pickupForm?: UserPickupFormResponse) =>
    (pickupForm?.pickup_persons?.length ?? 0) > 0
        ? [...pickupForm!.pickup_persons]
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map(({ name, phone }) => ({ name, phone: formatPhone(phone) }))
        : [{ name: "", phone: "" }];

interface Props {
    pickupForm?: UserPickupFormResponse;
}

const PickupPersonsFormEntry = ({ pickupForm }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const updatePickupPersons = useUpdatePickupPersons();

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { pickup_persons: getDefaultPersons(pickupForm) },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "pickup_persons",
    });

    const handleOpen = () => {
        reset({ pickup_persons: getDefaultPersons(pickupForm) });
        onOpen();
    };

    const handleClose = () => {
        reset({ pickup_persons: getDefaultPersons(pickupForm) });
        onClose();
    };

    const onSubmit = (data: FormData) => {
        updatePickupPersons.mutate({ pickup_persons: data.pickup_persons });
        onClose();
    };

    const isCurrent = isCurrentYear(pickupForm);
    const hasForm = !!pickupForm?.updated_at;

    return (
        <HStack
            padding={4}
            borderWidth="1px"
            borderRadius="md"
            borderColor="brand.secondary"
            justify="space-between"
        >
            <HStack spacing={3}>
                <Text fontWeight="bold">Authorized Pickup Persons</Text>
                {isCurrent ? (
                    <Badge bgColor="brand.green" color="brand.primary">
                        Updated for {new Date().getFullYear()}
                    </Badge>
                ) : hasForm ? (
                    <Badge bgColor="brand.warning" color="brand.primary">
                        Needs annual update
                    </Badge>
                ) : (
                    <Badge bgColor="brand.secondary" color="brand.primary">
                        Not yet completed
                    </Badge>
                )}
            </HStack>
            <Button
                bgColor="brand.buttonBg"
                color="brand.primary"
                size="sm"
                onClick={handleOpen}
            >
                {!hasForm ? "Fill Out Form" : isCurrent ? "View / Edit" : "Update"}
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="md">Authorized Pickup Persons</Heading>
                        <Text
                            fontSize="sm"
                            color="brand.text"
                            fontWeight="normal"
                            marginTop={1}
                        >
                            List everyone authorized to pick up your children from camp.
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Authorized Pickup Persons *</FormLabel>
                            {errors.pickup_persons?.root?.message && (
                                <Text color="red.500" fontSize="sm" mb={2}>
                                    {errors.pickup_persons.root.message}
                                </Text>
                            )}
                            <Stack spacing={2}>
                                {fields.map((field, i) => (
                                    <HStack
                                        key={field.id}
                                        spacing={2}
                                        alignItems="start"
                                    >
                                        <InputError
                                            label={
                                                errors.pickup_persons?.[i]?.name
                                                    ?.message
                                            }
                                            isOpen={
                                                !!errors.pickup_persons?.[i]?.name
                                            }
                                        >
                                            <Input
                                                {...register(
                                                    `pickup_persons.${i}.name`
                                                )}
                                                placeholder="Name"
                                            />
                                        </InputError>
                                        <InputError
                                            label={
                                                errors.pickup_persons?.[i]?.phone
                                                    ?.message
                                            }
                                            isOpen={
                                                !!errors.pickup_persons?.[i]?.phone
                                            }
                                        >
                                            <Controller
                                                name={`pickup_persons.${i}.phone`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                formatPhone(
                                                                    e.target.value
                                                                )
                                                            )
                                                        }
                                                        placeholder="Phone"
                                                        type="tel"
                                                    />
                                                )}
                                            />
                                        </InputError>
                                        {i === 0 ? (
                                            <Tooltip
                                                label="This phone number will be used to text pickup confirmation codes, for the security of your children."
                                                placement="top"
                                            >
                                                <Box
                                                    as="span"
                                                    display="inline-flex"
                                                    alignItems="center"
                                                    h="40px"
                                                    color="brand.primary"
                                                >
                                                    <AiOutlineQuestionCircle size="20px" />
                                                </Box>
                                            </Tooltip>
                                        ) : (
                                            <DeleteButton
                                                onConfirm={() => remove(i)}
                                            >
                                                {fields[i].name ||
                                                    `pickup person ${i + 1}`}
                                            </DeleteButton>
                                        )}
                                    </HStack>
                                ))}
                            </Stack>
                            <Box mt={2}>
                                <ActionButton
                                    Component={FaPlus}
                                    label="Add pickup person"
                                    onClick={() =>
                                        append({ name: "", phone: "" })
                                    }
                                />
                            </Box>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <HStack spacing={3}>
                            <Button
                                variant="ghost"
                                onClick={handleClose}
                                color="brand.primary"
                            >
                                Cancel
                            </Button>
                            <Button
                                bgColor="brand.buttonBg"
                                color="brand.primary"
                                onClick={handleSubmit(onSubmit)}
                            >
                                Save
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </HStack>
    );
};

export default PickupPersonsFormEntry;
