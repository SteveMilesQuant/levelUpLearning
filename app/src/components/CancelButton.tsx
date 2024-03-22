import TextButton from "./TextButton";

interface Props {
  children: string;
  onClick: () => void;
  disabled?: boolean;
}

const CancelButton = ({ children, onClick, disabled }: Props) => {
  return (
    <TextButton onClick={onClick} isDisabled={disabled}>
      {children}
    </TextButton>
  );
};

export default CancelButton;
