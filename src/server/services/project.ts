import { prisma } from "../db/client";

type CreateProject = {
  name: string;
  description: string;
};

type UpdateProject = {
  name?: string | undefined;
  description?: string | undefined;
};

export default class ProjectService {
  async findById(id: string) {
    return prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        taskLists: {
          include: {
            tasks: {},
          },
        },
      },
    });
  }

  async findByUserEmail(email: string) {
    return prisma.project.findMany({
      where: {
        users: {
          some: {
            email,
          },
        },
      },
    });
  }

  async create(input: CreateProject, userEmail: string) {
    return prisma.project.create({
      data: {
        ...input,
        users: {
          connect: {
            email: userEmail,
          },
        },
      },
    });
  }

  async update(id: string, input: UpdateProject) {
    return prisma.project.update({
      data: input,
      where: { id },
    });
  }

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }
}
