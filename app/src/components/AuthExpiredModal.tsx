import {
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useAuth } from "../users";
import AuthButton from "./AuthButton";

const AuthExpiredModal = () => {
  const { expiration } = useAuth();
  return (
    <Modal
      isOpen={expiration ? expiration <= new Date() : false}
      onClose={() => {}}
      size="sm"
    >
      <ModalOverlay />
      <ModalContent bgColor="gray.100">
        <Stack margin={5} align="center" spacing={5}>
          <Text>Your sign in has expired.</Text>
          <AuthButton />
        </Stack>
      </ModalContent>
    </Modal>
  );
};

export default AuthExpiredModal;
