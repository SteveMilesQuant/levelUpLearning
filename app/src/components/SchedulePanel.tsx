import { Image, Stack } from "@chakra-ui/react"
import amschedule from "../assets/AMSchedule.webp";
import pmschedule from "../assets/PMSchedule.webp";
import schedulenote from "../assets/ScheduleNote.webp";

const SchedulePanel = () => {
    return (
        <Stack spacing={5} marginY={{ base: 5 }} paddingX={{ base: 5, md: 20, lg: "25%", xl: "25%" }} align="center">
            <Image src={amschedule} alt="Sample camp schedule - morning" />
            <Image src={pmschedule} alt="Sample camp schedule - afternoon" />
            <Image src={schedulenote} alt="Note: these sample schedules are not exact" />
        </Stack>
    )
}

export default SchedulePanel