import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createProtectedRouter } from "./context";
import ProjectService from "../services/project";

const service = new ProjectService();

export const projectRouter = createProtectedRouter()
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const project = await service.findById(id);
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No project with id '${id}'`,
        });
      }
      return project;
    },
  })
  .query("byUserId", {
    input: z.object({
      email: z.string().email(),
    }),
    async resolve({ input }) {
      const { email } = input;
      const projects = await service.findByUserEmail(email);
      return projects;
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string().min(1).max(100),
      description: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
      const project = await service.create(
        input,
        ctx.session?.user?.email as string
      );
      return project;
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
      const project = await service.update(id, data);
      return project;
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
