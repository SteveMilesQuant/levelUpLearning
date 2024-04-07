import {
  Divider,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import useResourceGroupForm from "../hooks/useResourceGroupForm";
import SubmitButton from "../../components/SubmitButton";
import ResourceGroupFormBody from "./ResourceGroupFormBody";

export interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const ResourceGroupFormModal = ({ title, isOpen, onClose }: Props) => {
  const resourceGroupForm = useResourceGroupForm();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resourceGroupForm.handleClose();
        onClose();
      }}
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="2xl">{title}</Heading>
          <Divider orientation="horizontal" marginTop={1}></Divider>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ResourceGroupFormBody {...resourceGroupForm} isReadOnly={false} />
        </ModalBody>
        <ModalFooter>
          <SubmitButton
            onClick={() => {
              resourceGroupForm.handleSubmit();
              if (resourceGroupForm.isValid) {
                resourceGroupForm.handleClose();
                onClose();
              }
            }}
          >
            Submit
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResourceGroupFormModal;
