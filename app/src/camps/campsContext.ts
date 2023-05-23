import { createContext } from "react";

export enum CampsContextType {
  camps,
  teach,
  schedule,
}

const CampsContext = createContext<CampsContextType>(CampsContextType.camps);

export default CampsContext;
