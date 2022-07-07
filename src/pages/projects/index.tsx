import { Box, Button, Container, HStack, Text } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { createSSGHelper } from "../../utils/ssg-helper";
import { trpc } from "../../utils/trpc";

import { MdKeyboardArrowRight } from "react-icons/md";
import { HiOutlineViewBoards } from "react-icons/hi";

const Projects: React.FC = () => {
  const router = useRouter();
  const { data } = useSession();
  const { data: projects } = trpc.useQuery([
    "project.byUserId",
    { email: data?.user?.email as string },
  ]);

  return (
    <Container maxW="3xl" padding="40px">
      <HStack justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">
          My Projects
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => router.push("/projects/create")}
        >
          New Project
        </Button>
      </HStack>
      {!projects?.length && <Text>You don`t have projects</Text>}
      {projects?.map((project) => (
        <Box key={project.id} boxShadow="md" p="30px" my="10px">
          <HStack justifyContent="space-between">
            <HStack>
              <HiOutlineViewBoards size={30} />
              <Box pl="20px">
                <Text fontSize="lg" fontWeight="bold">
                  {project.name}
                </Text>
                <Text>{project.description}</Text>
              </Box>
            </HStack>
            <Button
              size="lg"
              variant="unstyled"
              rightIcon={<MdKeyboardArrowRight size={30} />}
              onClick={() => router.push(`/projects/${project.id}`)}
            ></Button>
          </HStack>
        </Box>
      ))}
    </Container>
  );
};

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

  const ssg = await createSSGHelper(context);
  await ssg.fetchQuery("project.byUserId", {
    email: session.user?.email as string,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}

export default Projects;
