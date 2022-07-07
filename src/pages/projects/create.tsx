import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

const schema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
});

type Project = z.infer<typeof schema>;

function CreateProject() {
  const router = useRouter();
  const cancelRef = useRef<any>();

  const { mutate, isLoading, isError, isSuccess } = trpc.useMutation([
    "project.create",
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Project>({
    resolver: zodResolver(schema),
  });

  const goBack = () => {
    router.back();
  };

  return (
    <Container padding="50px" mt={6} boxShadow="md">
      <Text fontSize="xl" fontWeight="bold" marginBottom="15px">
        Create new project
      </Text>
      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <FormControl>
          <Stack spacing={3}>
            <Box>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input {...register("name")} />
              {!!errors?.name ? (
                <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
              ) : (
                <FormHelperText>The name of project</FormHelperText>
              )}
            </Box>
            <Box>
              <FormLabel htmlFor="description">Description</FormLabel>
              <Input {...register("description")} />
              {!!errors?.description ? (
                <FormErrorMessage>
                  {errors?.description?.message}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  A short description of this project
                </FormHelperText>
              )}
            </Box>
            {isError && (
              <Box>
                <Text color="red">System error, please try again later</Text>
              </Box>
            )}
            {isSuccess && (
              <AlertDialog
                isOpen={isSuccess}
                leastDestructiveRef={cancelRef}
                onClose={goBack}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader
                      fontSize="lg"
                      fontWeight="bold"
                      color="green"
                    >
                      Success
                    </AlertDialogHeader>
                    <AlertDialogBody>
                      <Text>Project created successfully</Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button colorScheme="blue" onClick={goBack}>
                        Ok
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            )}
          </Stack>
          <HStack mt={8} justifyContent="space-around">
            <Button colorScheme="red" onClick={goBack}>
              Cancel
            </Button>
            <Button colorScheme="blue" isLoading={isLoading} type="submit">
              Submit
            </Button>
          </HStack>
        </FormControl>
      </form>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default CreateProject;
