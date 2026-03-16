import useStudents from '../../students/hooks/useStudents';
import useForms from '../../forms/hooks/useForms';
import usePickupPersons from '../../forms/hooks/usePickupPersons';
import { isFormCurrentYear } from '../../forms/StudentFormTypes';
import { isPickupFormCurrentYear } from '../../forms/PickupPersonsTypes';
import { hasFutureCamp } from '../../students/utils/hasFutureCamp';
import useUser from './useUser';

const useHasMissingForms = (): boolean => {
    const { data: user } = useUser();
    const { data: students } = useStudents();
    const { data: forms } = useForms();
    const { data: pickupForm } = usePickupPersons();
    const isGuardian = user?.roles.includes("GUARDIAN");
    return !!(isGuardian && (
        students?.filter(hasFutureCamp).some(s => !isFormCurrentYear(forms?.find(f => f.student_id === s.id)))
        || !isPickupFormCurrentYear(pickupForm)
    ));
};

export default useHasMissingForms;
