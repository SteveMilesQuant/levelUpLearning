import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
  CloseButton,
  HStack,
} from "@chakra-ui/react";

interface Props {
  children: string;
  status: "success" | "error";
  onClose?: () => void;
}

const AlertMessage = ({ status, children, onClose }: Props) => {
  const title = status === "error" ? "Error!" : "Success!";
  return (
    <Alert status={status} marginBottom={5}>
      <Stack>
        <HStack spacing={1} justify="start" alignItems="center">
          <AlertIcon />
          <AlertTitle>{title}</AlertTitle></HStack>
        <AlertDescription whiteSpace="pre-line">{children}</AlertDescription>
      </Stack>
      {onClose && (
        <CloseButton onClick={onClose} position="absolute" right={3} />
      )}
    </Alert>
  );
};

export default AlertMessage;
