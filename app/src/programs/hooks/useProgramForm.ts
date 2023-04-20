import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import programService, { Program } from "../services/program-service";

const programSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  tags: z.string(),
  description: z.string(),
});

export type FormData = z.infer<typeof programSchema>;

interface Props {
  program?: Program;
  setProgram?: (program?: Program) => void;
  programs?: Program[];
  setPrograms?: (programs: Program[]) => void;
}

const useProgramForm = ({
  program,
  setProgram,
  programs,
  setPrograms,
}: Props) => {
  const [selectedGradeRange, setSelectedGradeRange] = useState(
    program?.grade_range || [6, 8]
  );

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(programSchema),
    defaultValues: useMemo(() => {
      return { grade_range: [6, 8], ...program };
    }, [program]),
  });

  useEffect(() => {
    reset({ ...program });
    setSelectedGradeRange(program?.grade_range || [6, 8]);
  }, [program]);

  const handleClose = () => {
    reset({ ...program });
    setSelectedGradeRange(program?.grade_range || [6, 8]);
  };

  const handleSubmitLocal = (data: FieldValues) => {
    const newProgram = {
      id: 0,
      ...program,
      ...data,
      grade_range: selectedGradeRange,
    } as Program;
    const origProgram = { ...program } as Program;
    let origPrograms = programs ? [...programs] : [];

    // Optimistic rendering
    if (setProgram) {
      setProgram(newProgram);
    }
    if (setPrograms) {
      setPrograms(programs ? [newProgram, ...programs] : []);
    }

    // If program was supplied, we are updating
    // Otherwise, creating new
    if (program) {
      var promise = programService.update(newProgram);
    } else {
      promise = programService.create(newProgram);
    }

    promise
      .then((res) => {
        if (setPrograms) setPrograms([res.data, ...origPrograms]);
      })
      .catch((err) => {
        // If it doesn't work out, reset to original
        if (setProgram) setProgram(origProgram);
        if (setPrograms && programs) setPrograms(origPrograms);
        console.log(err.message);
      });
  };
  const handleSubmit = handleFormSubmit(handleSubmitLocal);

  return {
    register,
    errors,
    handleClose,
    handleSubmit,
    selectedGradeRange,
    setSelectedGradeRange,
  };
};

export default useProgramForm;
