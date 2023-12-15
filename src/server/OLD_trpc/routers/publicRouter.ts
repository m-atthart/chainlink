import { createRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const publicRouter = createRouter({
	getChain: publicProcedure
		.input(
			z.object({
				username: z.string(),
			})
		)
		.query(async ({ input, ctx }) => {
			const chain = await ctx.prisma.link.findMany({
				where: {
					username: {
						equals: input.username,
					},
				},
				orderBy: {
					timestamp: "desc",
				},
			});

			return chain;
		}),
});
