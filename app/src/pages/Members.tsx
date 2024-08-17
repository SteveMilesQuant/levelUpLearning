import BodyContainer from "../components/BodyContainer";
import PageHeader from "../components/PageHeader";
import { UserTable } from "../users";

const Members = () => {
  return (
    <BodyContainer>
      <PageHeader>Members</PageHeader>
      <UserTable />
    </BodyContainer>
  );
};

export default Members;
