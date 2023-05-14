import PageHeader from "../components/PageHeader";
import { SettingsTabs } from "../users";

const Settings = () => {
  return (
    <>
      <PageHeader hideUnderline={true}>Profile and settings</PageHeader>
      <SettingsTabs />
    </>
  );
};

export default Settings;
