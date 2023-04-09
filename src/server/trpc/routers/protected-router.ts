import * as trpc from "@trpc/server";
import { createLegacyRouter } from "../index";

/**
 * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
 */
export function createProtectedRouter() {
	return createLegacyRouter().middleware(({ ctx, next }) => {
		if (!ctx.session?.user) {
			throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
		}
		return next({
			ctx: {
				...ctx,
				// infers that `session` is non-nullable to downstream resolvers
				session: { ...ctx.session, user: ctx.session.user },
			},
		});
	});
}
