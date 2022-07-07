import { prisma } from "../db/client";

type CreateTaskList = {
  name: string;
  projectId: string;
};

type UpdateTaskList = {
  name?: string | undefined;
};

export default class TaskListService {
  async findById(id: string) {
    return prisma.taskList.findUnique({
      where: {
        id,
      },
      include: {
        tasks: {},
      },
    });
  }

  async findByProjectId(projectId: string) {
    return prisma.taskList.findMany({
      where: {
        projectId: projectId,
      },
    });
  }

  async create(input: CreateTaskList) {
    return prisma.taskList.create({
      data: input,
    });
  }

  async update(id: string, input: UpdateTaskList) {
    return prisma.taskList.update({
      data: input,
      where: { id },
    });
  }

  async delete(id: string) {
    return prisma.taskList.delete({ where: { id } });
  }
}
