import { createRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const protectedRouter = createRouter({
	addToChain: protectedProcedure
		.input(
			z.object({
				url: z.string(),
				notes: z.string().nullable(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			console.log("addToChain");
			const response = await ctx.prisma.link.create({
				data: {
					url: input.url,
					notes: input.notes,
					username: ctx.session.user.username,
				},
			});
			return response;
		}),
});
