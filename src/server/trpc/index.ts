import { mergeRouters } from "./trpc";
import { publicRouter } from "./routers/publicRouter";
import { protectedRouter } from "./routers/protectedRouter";

export const appRouter = mergeRouters(publicRouter, protectedRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
