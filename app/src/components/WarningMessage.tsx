import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
} from "@chakra-ui/react";

interface Props {
  children: string;
  onClose?: () => void;
}

const WarningMessage = ({ children, onClose }: Props) => {
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertTitle>Warning!</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
      {onClose && (
        <CloseButton
          alignSelf="flex-start"
          position="relative"
          right={-1}
          onClick={onClose}
        />
      )}
    </Alert>
  );
};

export default WarningMessage;
