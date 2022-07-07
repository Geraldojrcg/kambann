// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { userRouter } from "./user";
import { projectRouter } from "./project";
import { taskListRouter } from "./task-list";
import { taskRouter } from "./task";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("user.", userRouter)
  .merge("project.", projectRouter)
  .merge("taskList.", taskListRouter)
  .merge("task.", taskRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
