import { Box, Tooltip, useDisclosure } from "@chakra-ui/react";
import { IoCarOutline } from "react-icons/io5";
import ManualPickupModal from "./ManualPickupModal";

interface Props {
    campId: number;
    studentId: number;
    studentName: string;
}

const ManualPickupIcon = ({ campId, studentId, studentName }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Tooltip label="Manual pickup">
                <Box
                    as="span"
                    display="inline-flex"
                    cursor="pointer"
                    color="brand.primary"
                    onClick={onOpen}
                >
                    <IoCarOutline size="1.5em" />
                </Box>
            </Tooltip>

            <ManualPickupModal
                isOpen={isOpen}
                onClose={onClose}
                campId={campId}
                studentId={studentId}
                studentName={studentName}
            />
        </>
    );
};

export default ManualPickupIcon;
