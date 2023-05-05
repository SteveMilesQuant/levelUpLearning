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
  Box,
} from "@chakra-ui/react";

interface Props {
  children?: JSX.Element;
  title: string;
  holdOpen: boolean;
  onUpdate: () => void;
  onClose: () => void;
}

const EditButtonPopover = ({
  children,
  title,
  holdOpen,
  onUpdate,
  onClose,
}: Props) => (
  <Box>
    {/* Put popover in a box, to avoid warnings about it, when container might try to apply css*/}
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
              <PopoverCloseButton
                onClick={() => {
                  onClosePopover();
                  onClose();
                }}
              />
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
                  onClick={() => {
                    onUpdate();
                    if (!holdOpen) {
                      onClosePopover();
                      onClose();
                    }
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
  </Box>
);

export default EditButtonPopover;
