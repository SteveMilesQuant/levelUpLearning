import { AiFillEdit } from "react-icons/ai";
import ActionButton from "./ActionButton";

interface Props {
  onClick: () => void;
}

const EditButton = ({ onClick }: Props) => {
  return <ActionButton Component={AiFillEdit} label="Edit" onClick={onClick} />;
};

export default EditButton;
