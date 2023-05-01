import { useEffect, useState } from "react";
import { Camp } from "../Camp";
import { useAddCamp, useUpdateCamp } from "./useCamps";

const useCampForm = (camp?: Camp) => {
  const [selectedProgram, setSelectedProgram] = useState(camp?.program);
  const [selectedInstructor, setSelectedInstructor] = useState(
    camp?.primary_instructor
  );
  const [isValid, setIsValid] = useState(false);

  const reset = (resetCamp?: Camp) => {
    setSelectedProgram(resetCamp?.program);
    setSelectedInstructor(resetCamp?.primary_instructor);
  };
  const handleClose = reset;

  useEffect(() => reset(camp), [camp]);
  useEffect(() => {
    if (selectedProgram && selectedInstructor) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [selectedProgram, selectedInstructor]);

  const addCamp = useAddCamp();
  const updateCamp = useUpdateCamp(() => {
    reset(camp);
  });

  const handleSubmit = () => {
    if (!isValid) return;

    const newCamp = {
      id: 0,
      ...camp,
      program_id: selectedProgram?.id,
      program: selectedProgram,
      primary_instructor_id: selectedInstructor?.id,
      primary_instructor: selectedInstructor,
    } as Camp;

    if (camp) {
      // Update student
      updateCamp.mutate(newCamp);
    } else {
      // Add new student
      addCamp.mutate(newCamp);
    }
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
