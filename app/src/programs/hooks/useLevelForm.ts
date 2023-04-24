import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import levelService, { Level } from "../services/level-service";
import { Program } from "../services/program-service";

const levelSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string(),
});

export type FormData = z.infer<typeof levelSchema>;

interface Props {
  program?: Program;
  level?: Level;
  setLevel?: (level?: Level) => void;
  levels?: Level[];
  setLevels?: (levels: Level[]) => void;
}

const useLevelForm = ({
  program,
  level,
  setLevel,
  levels,
  setLevels,
}: Props) => {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid: isValidForm },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(levelSchema),
    defaultValues: useMemo(() => {
      return { ...level };
    }, [level]),
  });
  const isValid = isValidForm;

  useEffect(() => {
    reset({ ...level });
  }, [level]);

  const handleClose = () => {
    reset({ ...level });
  };

  const handleSubmitLocal = (data: FieldValues) => {
    if (!program) return;
    const origLevel = { ...level } as Level;
    const origLevels = levels ? [...levels] : [];

    // Optimistic rendering
    let nextIdx = 1;
    if (levels) {
      nextIdx =
        levels.reduce(
          (max, l) => (max > l.list_index ? max : l.list_index),
          0
        ) + 1;
    }
    const newLevel = {
      id: 0,
      list_index: nextIdx,
      ...level,
      ...data,
    } as Level;
    if (setLevel) {
      setLevel(newLevel);
    }
    if (setLevels) {
      if (level) {
        // Just updating one level in the list
        const newLevels = origLevels.map((s) =>
          s.id === newLevel.id ? newLevel : s
        );
        newLevels.sort((a, b) => a.list_index - b.list_index);
        setLevels(newLevels);
      } else {
        // Adding a new level
        setLevels([...origLevels, newLevel]);
      }
    }

    // If level was supplied, we are updating
    // Otherwise, creating new
    if (level) {
      var promise = levelService(program.id).update(newLevel.id, newLevel);
    } else {
      promise = levelService(program.id).create(newLevel);
    }

    promise
      .then((res) => {
        if (setLevels && !level) {
          // Adding a new student... this will update id and list_index
          setLevels([...origLevels, res.data]);
        }
      })
      .catch((err) => {
        // If it doesn't work out, reset to original
        if (setLevel) setLevel(origLevel);
        if (setLevels) setLevels(origLevels);
        console.log(err.message);
      });
  };
  const handleSubmit = handleFormSubmit(handleSubmitLocal);

  return {
    register,
    errors,
    isValid,
    handleClose,
    handleSubmit,
  };
};

export default useLevelForm;
