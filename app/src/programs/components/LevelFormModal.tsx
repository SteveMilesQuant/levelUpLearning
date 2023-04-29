import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Divider,
  Heading,
} from "@chakra-ui/react";
import LevelFormBody from "./LevelFormBody";
import useLevelForm from "../hooks/useLevelForm";
import { Level } from "../Level";
import SubmitButton from "../../components/SubmitButton";
import { Program } from "../Program";

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  program?: Program;
  levels: Level[];
  setLevels: (levels: Level[]) => void;
}

const LevelFormModal = ({
  title,
  isOpen,
  onClose,
  program,
  levels,
  setLevels,
}: Props) => {
  const levelForm = useLevelForm({ program, levels, setLevels });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        levelForm.handleClose();
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
          <LevelFormBody {...levelForm} />
        </ModalBody>
        <ModalFooter>
          <SubmitButton
            onClick={() => {
              levelForm.handleSubmit();
              if (levelForm.isValid) {
                levelForm.handleClose();
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

export default LevelFormModal;
