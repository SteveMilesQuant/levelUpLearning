import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
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
      <AlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
      {onClose && (
        <CloseButton onClick={onClose} position="absolute" right={3} />
      )}
    </Alert>
  );
};

export default AlertMessage;
