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
    <Alert status={status}>
      <AlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
      {onClose && <CloseButton onClick={onClose} />}
    </Alert>
  );
};

export default AlertMessage;
