import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "../server/router";
import { createContext } from "../server/router/context";
import superjson from "superjson";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

export const createSSGHelper = async (context: GetServerSidePropsContext) =>
  createSSGHelpers({
    router: appRouter,
    ctx: await createContext({
      req: context.req as NextApiRequest,
      res: context.res as NextApiResponse,
    }),
    transformer: superjson,
  });
