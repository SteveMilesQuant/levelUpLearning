import PageHeader from "../components/PageHeader";
import { UserTable } from "../users";

const Members = () => {
  return (
    <>
      <PageHeader label="Members" />
      <UserTable />
    </>
  );
};

export default Members;
