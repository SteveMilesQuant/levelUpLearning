import {
  Button,
  FormControl,
  FormLabel,
  VStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsChevronDown } from "react-icons/bs";
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";

const schema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const StudentForm = ({ title, isOpen, onClose }: Props) => {
  const grades = Array.from(Array(12).keys()).map((x) => x + 1);
  const [selectedGrade, setSelectedGrade] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = function (data: FieldValues) {
    if (selectedGrade <= 0) return;
    console.log(selectedGrade, data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        setSelectedGrade(0);
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={2}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input {...register("name")} type="text" />
            </FormControl>
            {errors.name && (
              <ErrorMessage>{errors.name.message || ""}</ErrorMessage>
            )}
            <FormControl>
              <FormLabel>Grade</FormLabel>
              <Menu>
                <MenuButton as={Button} rightIcon={<BsChevronDown />}>
                  {selectedGrade > 0 ? selectedGrade : "Grade"}
                </MenuButton>
                <MenuList>
                  {grades.map((grade) => (
                    <MenuItem
                      key={grade}
                      onClick={() => {
                        setSelectedGrade(grade);
                      }}
                    >
                      {grade}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>
            {selectedGrade === -1 && (
              <ErrorMessage>Grade level is required.</ErrorMessage>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={(e) => {
              // I'm not a fan of this nonsense - I'll figure out a better answer later
              if (selectedGrade === 0) setSelectedGrade(-1);
              handleSubmit(onSubmit)(e);
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StudentForm;
