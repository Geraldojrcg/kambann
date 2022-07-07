import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./context";
import UserService from "../services/user";

const service = new UserService();

export const userRouter = createProtectedRouter().query("byId", {
  input: z.object({
    id: z.string(),
  }),
  async resolve({ input }) {
    const { id } = input;
    const user = await service.findById(id);
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No user with id '${id}'`,
      });
    }
    return user;
  },
});
