import { CACHE_KEY_FORMS, StudentFormData, StudentFormResponse } from "../StudentFormTypes";
import APIHooks from "../../services/api-hooks";
import APIClient from "../../services/api-client";
import ms from "ms";

const formClient = new APIClient<StudentFormResponse, StudentFormData>("/forms");

const formHooks = new APIHooks<StudentFormResponse, StudentFormData>(
    formClient,
    CACHE_KEY_FORMS,
    ms("5m")
);

export default formHooks.useDataList;
export const useFormByStudent = (studentId: number) =>
    formHooks.useData(studentId);
export const useAddForm = formHooks.useAdd;
export const useUpdateForm = formHooks.useUpdate;
export const useDeleteForm = formHooks.useDelete;
