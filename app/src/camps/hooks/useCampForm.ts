import { useEffect, useMemo, useState } from "react";
import campService, { Camp, CampData } from "../services/camp-service";

interface Props {
  camp?: Camp;
  setCamp?: (camp?: Camp) => void;
  camps?: Camp[];
  setCamps?: (camps: Camp[]) => void;
}

const useCampForm = ({ camp, setCamp, camps, setCamps }: Props) => {
  const [selectedProgram, setSelectedProgram] = useState(camp?.program);
  const [selectedInstructor, setSelectedInstructor] = useState(
    camp?.primary_instructor
  );
  const [isValid, setIsValid] = useState(false);

  const reset = () => {
    setSelectedProgram(camp?.program);
    setSelectedInstructor(camp?.primary_instructor);
  };
  const handleClose = reset;
  useEffect(reset, [camp]);

  const handleSubmit = () => {
    const origCamp = { ...camp } as Camp;
    const origCamps = camps ? [...camps] : [];

    // Optimistic rendering
    const newCamp = {
      id: 0,
      ...camp,
      program_id: selectedProgram?.id,
      program: selectedProgram,
      primary_instructor_id: selectedInstructor?.id,
      primary_instructor: selectedInstructor,
    } as Camp;
    if (setCamp) {
      setCamp(newCamp);
    }
    if (setCamps) {
      if (camp) {
        // Just updating one camp in the list
        setCamps(origCamps.map((s) => (s.id === newCamp.id ? newCamp : s)));
      } else {
        // Adding a new camp
        setCamps([newCamp, ...origCamps]);
      }
    }

    // If camp was supplied, we are updating
    // Otherwise, creating new
    if (camp) {
      var promise = campService.update(newCamp.id, newCamp as CampData);
    } else {
      promise = campService.create(newCamp as CampData);
    }

    promise
      .then((res) => {
        if (setCamps && !camp) {
          // Adding a new student... this will update id
          setCamps([res.data, ...origCamps]);
        }
      })
      .catch((err) => {
        // If it doesn't work out, reset to original
        if (setCamp) setCamp(origCamp);
        if (setCamps) setCamps(origCamps);
        console.log(err.message);
      });
  };

  return {
    isValid,
    handleClose,
    handleSubmit,
    selectedProgram,
    setSelectedProgram,
    selectedInstructor,
    setSelectedInstructor,
  };
};

export default useCampForm;
