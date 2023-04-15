import { AiFillDelete } from "react-icons/ai";
import ActionButton from "./ActionButton";

interface Props {
  onClick: () => void;
}

const DeleteButton = ({ onClick }: Props) => {
  return (
    <ActionButton Component={AiFillDelete} label="Delete" onClick={onClick} />
  );
};

export default DeleteButton;
