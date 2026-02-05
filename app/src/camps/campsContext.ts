import { createContext } from "react";

export enum CampsContextType {
  publicFullDay,
  publicHalfDay,
  publicSingleDay,
  teach,
  schedule,
}

const CampsContext = createContext<CampsContextType>(CampsContextType.publicFullDay);

export default CampsContext;
