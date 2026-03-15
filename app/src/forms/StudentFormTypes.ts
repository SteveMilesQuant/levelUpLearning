export interface PickupPerson {
    id?: number;
    name: string;
    phone: string;
    sort_order?: number;
}

export interface StudentFormData {
    student_id: number;
    child_school: string;
    parent_name: string;
    parent_email: string;
    parent_phone: string;
    emergency_contact: string;
    has_allergies: boolean | null;
    allergies: string;
    pickup_persons: PickupPerson[];
    additional_info: string;
    photo_permission: boolean | null;
    referral_source: string;
}

export interface StudentFormResponse extends StudentFormData {
    id: number;
    student_name: string;
    student_grade_level: number;
    updated_at: string | null;
}

export const CACHE_KEY_FORMS = ["forms"];

export const isFormCurrentYear = (form?: StudentFormResponse): boolean => {
    if (!form?.updated_at) return false;
    const updatedDate = new Date(form.updated_at);
    const jan1 = new Date(new Date().getFullYear(), 0, 1);
    return updatedDate >= jan1;
};
