import { locale } from "../../constants";
import { Camp } from "../Camp";

export function formatCamp(camp: Camp): string {
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

    return `${camp.program.title} on ${dateStr}`;
}