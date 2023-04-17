import { AiFillEdit } from "react-icons/ai";
import ActionButton from "./ActionButton";
import {
  Button,
  Text,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  PopoverFooter,
  HStack,
} from "@chakra-ui/react";
import { FormEvent } from "react";

interface Props {
  children: JSX.Element;
  title: string;
  onUpdate: (e: FormEvent) => void;
  onClose: () => void;
}

const EditButton = ({ children, title, onUpdate, onClose }: Props) => (
  <Popover>
    {({ onClose: onClosePopover }) => (
      <>
        <PopoverTrigger>
          <ActionButton Component={AiFillEdit} label="Edit" />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>
            <Text>
              <strong>{title}</strong>
            </Text>
            <PopoverCloseButton />
          </PopoverHeader>
          <PopoverBody>{children}</PopoverBody>
          <PopoverFooter>
            <HStack spacing={2} justifyContent="right">
              <Button
                onClick={() => {
                  onClosePopover();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  onClosePopover();
                  onUpdate(e);
                }}
                bgColor="blue.300"
              >
                Update
              </Button>
            </HStack>
          </PopoverFooter>
        </PopoverContent>
      </>
    )}
  </Popover>
);

export default EditButton;
