import {
  Box,
  Divider,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import useUser from "../hooks/useUser";
import ProfileFormBody from "./ProfileFormBody";
import useUserForm from "../hooks/useUserForm";
import SubmitButton from "../../components/SubmitButton";

const ContactVerificationModal = () => {
  const { data: user } = useUser();
  const userForm = useUserForm(user);

  if (!user) return null;

  const handleSubmit = () => {
    userForm.setValue("email_verified", true);
    userForm.handleSubmit();
  }

  return (
    <Modal
      isOpen={!user.email_verified}
      onClose={() => { }}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent bgColor="brand.disabled">
        <ModalHeader>
          <Box marginTop={3} >
            <Heading fontSize="2xl">Please verify your contact information</Heading>
            <Divider orientation="horizontal" marginTop={2}></Divider>
          </Box>
        </ModalHeader>
        <ModalBody>
          <Box paddingX={3}>
            <ProfileFormBody {...userForm} isReadOnly={false} contactOnly={true} />
          </Box>
        </ModalBody>
        <ModalFooter><SubmitButton onClick={handleSubmit}>Update</SubmitButton></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ContactVerificationModal;
