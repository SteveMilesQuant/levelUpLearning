import { Box, Tooltip, useDisclosure } from "@chakra-ui/react";
import { MdPersonPin } from "react-icons/md";
import useStudentPickupPersons from "../hooks/useStudentPickupPersons";
import PickupPersonsModal from "./PickupPersonsModal";

interface Props {
    campId: number;
    studentId: number;
    studentName: string;
}

const StudentPickupIcon = ({ campId, studentId, studentName }: Props) => {
    const { data: pickupPersons } = useStudentPickupPersons(campId, studentId);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const hasWarning = pickupPersons?.some((pp) => pp.sms_consent !== true);
    const color = hasWarning ? "brand.warning" : "brand.primary";

    return (
        <>
            <Tooltip label="Pickup persons">
                <Box
                    as="span"
                    display="inline-flex"
                    cursor="pointer"
                    color={color}
                    onClick={onOpen}
                >
                    <MdPersonPin size="1.5em" />
                </Box>
            </Tooltip>

            {pickupPersons && (
                <PickupPersonsModal
                    isOpen={isOpen}
                    onClose={onClose}
                    studentName={studentName}
                    pickupPersons={pickupPersons}
                />
            )}
        </>
    );
};

export default StudentPickupIcon;
