import { locale } from "../constants";

export const dateStrToDate = (dateStr?: string | null) => {
    return dateStr
        ? new Date("2023-01-01T" + dateStr)
        : null;
}

export const timeRangeToStr = (startTime?: Date | null, endTime?: Date | null) => {
    const timeStr = startTime && endTime
        ? startTime.toLocaleString(locale, {
            timeStyle: "short",
        }) +
        " to " +
        endTime.toLocaleString(locale, {
            timeStyle: "short",
        }) :
        "TBD";
    return timeStr;
}