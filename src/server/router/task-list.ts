import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./context";
import TaskListService from "../services/task-list";

const service = new TaskListService();

export const taskListRouter = createProtectedRouter()
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const taskList = await service.findById(id);
      if (!taskList) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No task list with id '${id}'`,
        });
      }
      return taskList;
    },
  })
  .query("byProjectId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const taskLists = await service.findByProjectId(id);
      return taskLists;
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string().min(1).max(100),
      projectId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const taskList = await service.create(input);
      return taskList;
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.string().uuid(),
      data: z
        .object({
          name: z.string().min(1).max(100),
        })
        .partial(),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const taskList = await service.update(id, data);
      return taskList;
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
