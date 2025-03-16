import { Image, Stack, useBreakpointValue } from "@chakra-ui/react"
import schedule from "../assets/schedule.webp";
import schedule_mobile from "../assets/schedule_mobile.webp";

const SchedulePanel = () => {
    const image = useBreakpointValue({ base: schedule_mobile, md: schedule });

    return (
        <Stack marginX={{ base: 2, xl: 20 }} align="center">
            <Image src={image} alt="Sample camp schedule" width={{ base: "90vw", md: "80vw", xl: "70vw" }} />
        </Stack>

    )
}

export default SchedulePanel