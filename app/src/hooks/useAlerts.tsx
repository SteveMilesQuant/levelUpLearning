import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

export interface Alert {
    status: "error" | "success";
    message: string
}

interface AlertsStore {
    alert?: Alert;
    setAlert: (alert?: Alert) => void;
}

const useAlertStore = create<AlertsStore>((set) => ({
    alert: undefined,
    setAlert: (alert?: Alert) => {
        set(() => ({ alert }));
    }
}));

if (process.env.NODE_ENV === "development")
    mountStoreDevtool("Alert store", useAlertStore);


const useAlert = () => {
    const { alert, setAlert } = useAlertStore();

    return { alert, setAlert };
};

export default useAlert;
