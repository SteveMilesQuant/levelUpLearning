import BodyContainer from "../components/BodyContainer";
import PageHeader from "../components/PageHeader";
import { SettingsTabs } from "../users";

const Settings = () => {
  return (
    <BodyContainer>
      <PageHeader hideUnderline={true}>Profile and settings</PageHeader>
      <SettingsTabs />
    </BodyContainer>
  );
};

export default Settings;
