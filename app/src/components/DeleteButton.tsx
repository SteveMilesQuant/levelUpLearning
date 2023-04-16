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
} from "@chakra-ui/react";

interface Props {
  objName: string; // name of the thing you want to delete
  onConfirm: () => void;
}

const DeleteButton = ({ onConfirm, objName }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <ActionButton Component={AiFillDelete} label="Delete" />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>
          <Text>
            <strong>Are you sure you want to remove {objName}?</strong>
          </Text>
          <PopoverCloseButton />
        </PopoverHeader>
        <PopoverBody>
          <Button onClick={onConfirm} colorScheme="red">
            Confirm
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteButton;
