import { AiFillDelete } from "react-icons/ai";
import ActionButton from "./ActionButton";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Button,
  Text,
  HStack,
} from "@chakra-ui/react";

interface Props {
  children: string; // name of the thing you want to delete
  onConfirm: () => void;
  disabled?: boolean;
}

const DeleteButton = ({ onConfirm, children, disabled }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <ActionButton
          Component={AiFillDelete}
          label="Delete"
          disabled={disabled}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>
          <Text>
            <strong>Are you sure you want to remove {children}?</strong>
          </Text>
          <PopoverCloseButton />
        </PopoverHeader>
        <PopoverBody>
          <HStack justifyContent="right">
            <Button onClick={onConfirm} colorScheme="red">
              Delete
            </Button>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteButton;
