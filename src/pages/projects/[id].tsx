import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  HStack,
  Text,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import CreateTaskListModal from "../../components/modals/CreateTaskListModal";
import { createSSGHelper } from "../../utils/ssg-helper";
import { trpc } from "../../utils/trpc";
import { TaskList } from "@prisma/client";

const Board = dynamic(import("../../components/Board"));

type PageProps = {
  id: string;
};

const Project: React.FC<PageProps> = ({ id }) => {
  const { data: project } = trpc.useQuery(["project.byId", { id }]);

  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [createTaskListModalOpen, setCreateTaskListModalOpen] = useState(false);

  useEffect(() => {
    setTaskLists(project?.taskLists as TaskList[]);
  }, [project]);

  const reorder = (list: TaskList[], startIndex: number, endIndex: number) => {
    const result = Array.from(list || []);
    const [removed] = result.splice(startIndex, 1);
    if (!removed) return;
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: any) => {
    console.log(result);

    if (!result.destination) return;

    if (result.source.droppableId === "taskList") {
      const items = reorder(
        taskLists,
        result.source.index,
        result.destination.index
      );
      setTaskLists(items as TaskList[]);
    }
  };

  return (
    <Container maxW="5xl" h="80vh" padding="40px">
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">{project?.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <HStack justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold">
          {project?.name}
        </Text>
        <Button
          colorScheme="blue"
          onClick={() => setCreateTaskListModalOpen(true)}
        >
          Add task list
        </Button>
      </HStack>
      {!taskLists?.length && <Text>You don`t have task lists</Text>}
      {typeof window !== "undefined" && (
        <Board
          key={taskLists?.length}
          taskLists={taskLists as any}
          onDragEnd={onDragEnd}
        />
      )}
      <CreateTaskListModal
        isOpen={createTaskListModalOpen}
        onClose={() => setCreateTaskListModalOpen(false)}
      />
    </Container>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext<PageProps>
) {
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
  const id = context.params?.id as string;
  try {
    await ssg.fetchQuery("project.byId", {
      id,
    });
    return {
      props: {
        trpcState: ssg.dehydrate(),
        id,
      },
    };
  } catch (error: any) {
    return {
      notFound: error?.data?.httpStatus || 500,
    };
  }
}

export default Project;
