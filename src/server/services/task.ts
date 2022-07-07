import { prisma } from "../db/client";

type CreateTask = {
  name: string;
  description: string;
  listId: string;
};

type UpdateTask = {
  name?: string | undefined;
  description?: string | undefined;
};

export default class TaskService {
  async findById(id: string) {
    return prisma.task.findUnique({
      where: {
        id,
      },
    });
  }

  async create(input: CreateTask, userEmail: string) {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
    return prisma.task.create({
      data: {
        ...input,
        ownerId: user?.id as string,
      },
    });
  }

  async update(id: string, input: UpdateTask) {
    return prisma.task.update({
      data: input,
      where: { id },
    });
  }

  async delete(id: string) {
    return prisma.task.delete({ where: { id } });
  }
}
