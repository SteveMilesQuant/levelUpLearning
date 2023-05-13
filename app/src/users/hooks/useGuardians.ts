import ms from "ms";
import APIClient from "../../services/api-client";
import APIHooks from "../../services/api-hooks";
import { CACHE_KEY_STUDENTS } from "../../students";
import { User, UserData } from "../User";
import { CACHE_KEY_CAMPS } from "../../camps";

const CACHE_KEY_GUARDIANS = ["guardians"];

const useGuardianHooks = (campId: number, studentId: number) =>
  new APIHooks<User, UserData>(
    new APIClient<User, UserData>(
      `/camps/${campId}/students/${studentId}/guardians`
    ),
    [
      ...CACHE_KEY_CAMPS,
      campId.toString(),
      ...CACHE_KEY_STUDENTS,
      studentId.toString(),
      ...CACHE_KEY_GUARDIANS,
    ],
    ms("5m")
  );

const useGuardians = (campId: number, studentId: number) => {
  const guardianHooks = useGuardianHooks(campId, studentId);
  return guardianHooks.useDataList();
};

export default useGuardians;
