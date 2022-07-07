import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./context";
import TaskService from "../services/task";

const service = new TaskService();

export const taskRouter = createProtectedRouter()
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const task = await service.findById(id);
      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No task with id '${id}'`,
        });
      }
      return task;
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string().min(1).max(100),
      description: z.string().min(1),
      listId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const task = await service.create(
        input,
        ctx.session?.user?.email as string
      );
      return task;
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.string().uuid(),
      data: z
        .object({
          name: z.string().min(1).max(100),
          description: z.string().min(1),
        })
        .partial(),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const task = await service.update(id, data);
      return task;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await service.delete(id);
      return {
        id,
      };
    },
  });
