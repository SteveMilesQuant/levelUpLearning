import { useEffect, useState } from "react";
import apiClient, { CanceledError } from "../services/api-client";

export interface Role {
  name: string;
}

const useRoles = (signedIn: boolean, setError: (error: string) => void) => {
  const controller = new AbortController();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (signedIn) {
      apiClient
        .get<Role[]>("/user/roles", { signal: controller.signal })
        .then((res) => {
          setRoles(res.data);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          setError("While getting roles: " + err.message);
        });

      return () => controller.abort();
    } else {
      setRoles([]);
    }
  }, [signedIn]);

  return roles;
};

export default useRoles;
