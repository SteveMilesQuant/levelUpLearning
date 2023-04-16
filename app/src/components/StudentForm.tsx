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
  Divider,
  Heading,
} from "@chakra-ui/react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsChevronDown } from "react-icons/bs";
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import studentService, { Student } from "../services/student-service";

const schema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (student: Student) => void;
}

const StudentForm = ({ title, isOpen, onClose, onAdd }: Props) => {
  const grades = Array.from(Array(12).keys()).map((x) => x + 1);

  const [selectedGrade, setSelectedGrade] = useState(0);
  const [haveSubmitted, setHaveSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const resetAndClose = () => {
    reset();
    setSelectedGrade(0);
    setHaveSubmitted(false);
    onClose();
  };

  const onSubmit = function (data: FieldValues) {
    if (selectedGrade === 0) return;
    studentService
      .create({
        id: 0,
        name: data.name,
        grade_level: selectedGrade,
      })
      .then((res) => {
        onAdd(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
    resetAndClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => resetAndClose()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="2xl">{title}</Heading>
          <Divider orientation="horizontal" marginTop={1}></Divider>
        </ModalHeader>
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
                  {selectedGrade || "Grade"}
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
            {haveSubmitted && selectedGrade === 0 && (
              <ErrorMessage>Grade level is required.</ErrorMessage>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={(e) => {
              // I'm not a fan of this nonsense - I'll figure out a better answer later
              setHaveSubmitted(true);
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
