import { Camp } from "../services/camp-service";
import { LevelSchedule } from "../services/level-schedule-service";
import LevelScheduleFormBody from "./LevelScheduleFormBody";
import useLevelScheduleForm from "../hooks/useLevelScheduleForm";

interface Props {
  levelSchedule: LevelSchedule;
}

const LevelScheduleForm = ({ levelSchedule }: Props) => {
  const levelScheduleForm = useLevelScheduleForm({ levelSchedule });

  return (
    <LevelScheduleFormBody
      {...levelScheduleForm}
      level={levelSchedule.level}
      isReadOnly={true}
    />
  );
};

export default LevelScheduleForm;
