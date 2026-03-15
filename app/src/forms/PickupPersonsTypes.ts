export interface PickupPerson {
    id?: number;
    name: string;
    phone: string;
    sort_order?: number;
}

export interface UserPickupFormData {
    pickup_persons: PickupPerson[];
}

export interface UserPickupFormResponse {
    updated_at: string | null;
    pickup_persons: PickupPerson[];
}

export const CACHE_KEY_PICKUP_PERSONS = ["pickup-persons"];

export const isPickupFormCurrentYear = (form?: UserPickupFormResponse): boolean => {
    if (!form?.updated_at) return false;
    const updatedDate = new Date(form.updated_at);
    const jan1 = new Date(new Date().getFullYear(), 0, 1);
    return updatedDate >= jan1;
};
