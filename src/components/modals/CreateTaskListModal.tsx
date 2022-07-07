import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";

type ComponentProps = {
  isOpen: boolean;
  onClose: () => void;
};

const schema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  projectId: z.string(),
});

type TaskList = z.infer<typeof schema>;

const CreateTaskListModal: React.FC<ComponentProps> = ({ isOpen, onClose }) => {
  const { query } = useRouter();

  const projectId = query.id as string;

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskList>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId,
    },
  });

  const { mutate, isLoading, isError } = trpc.useMutation("taskList.create", {
    onSuccess() {
      utils.invalidateQueries(["project.byId", { id: projectId }]);
      reset();
    },
  });

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={handleSubmit((data) => {
            mutate(data);
            onClose();
          })}
        >
          <ModalHeader>Create a new task list of this project</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Stack spacing={3}>
                <Box>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input {...register("name")} />
                  {!!errors?.name ? (
                    <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                  ) : (
                    <FormHelperText>The name of task list</FormHelperText>
                  )}
                </Box>
                {isError && (
                  <Box>
                    <Text color="red">
                      System error, please try again later
                    </Text>
                  </Box>
                )}
              </Stack>
            </FormControl>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" isLoading={isLoading} type="submit">
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateTaskListModal;
