import { Student } from "../Student";

export const hasFutureCamp = (student: Student): boolean => {
    const now = new Date();
    return student.student_camps.some(
        (camp) =>
            camp.dates &&
            camp.dates.length > 0 &&
            new Date(camp.dates[camp.dates.length - 1] + "T23:59:59") >= now
    );
};
