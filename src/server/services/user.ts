import { prisma } from "../db/client";

export default class UserService {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}
