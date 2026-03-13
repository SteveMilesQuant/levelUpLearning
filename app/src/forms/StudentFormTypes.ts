export interface StudentFormData {
    student_id: number;
    child_school: string;
    parent_name: string;
    parent_email: string;
    parent_phone: string;
    emergency_contact: string;
    allergies: string;
    pickup_persons: string;
    additional_info: string;
    photo_permission: boolean | null;
    referral_source: string;
}

export interface StudentFormResponse extends StudentFormData {
    id: number;
    student_name: string;
    student_grade_level: number;
}

export const CACHE_KEY_FORMS = ["forms"];
