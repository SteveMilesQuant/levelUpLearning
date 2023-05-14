import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { ProgramTabs, useProgram } from "../programs";

const Program = () => {
  const { id: idStr } = useParams();
  const id = idStr ? parseInt(idStr) : undefined;

  const { data: program, error, isLoading } = useProgram(id);

  if (isLoading) return null;
  if (error) throw error;

  return (
    <>
      <PageHeader hideUnderline={true}>{program.title}</PageHeader>
      <ProgramTabs program={program} />
    </>
  );
};

export default Program;
