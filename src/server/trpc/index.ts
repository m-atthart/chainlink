import { initTRPC, router } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Context } from "./context";

import { exampleRouter } from "./routers/example";
import { protectedExampleRouter } from "./routers/protected-example-router";

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

export const createLegacyRouter = () => router<Context>();

const legacyRouter = createLegacyRouter()
	.transformer(superjson)
	.merge("example.", exampleRouter)
	.merge("question.", protectedExampleRouter)
	.interop();

export const createRouter = t.router;

const mainRouter = createRouter({
	greeting: t.procedure.query(() => "hello from tRPC v10!"),
});

export const appRouter = t.mergeRouters(legacyRouter, mainRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
