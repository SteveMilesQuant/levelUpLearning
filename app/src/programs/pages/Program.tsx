import useProgramForm from "../hooks/useProgramForm";
import ProgramFormBody from "../components/ProgramFormBody";
import PageHeader from "../../components/PageHeader";
import { useParams } from "react-router-dom";
import useProgram from "../hooks/useProgram";
import BodyContainer from "../../components/BodyContainer";

const Program = () => {
  const { id } = useParams();
  const { program, error, isLoading, setProgram, setError } = useProgram(
    id ? parseInt(id) : undefined
  );
  const programForm = useProgramForm(
    program,
    () => {},
    () => {}
  );
  return (
    <BodyContainer>
      <PageHeader label={program?.title || ""}></PageHeader>
      <ProgramFormBody
        {...programForm}
        program={program || undefined}
        isReadOnly={true}
      />
    </BodyContainer>
  );
};

export default Program;
