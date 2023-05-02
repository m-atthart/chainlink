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

			// which is faster? who knows?
			// definitely note this one won't work easily on db branches because the user won't exist
			// const chain = await ctx.prisma.user.findUnique({
			// 	where: {
			// 		name: input.username,
			// 	},
			// 	include: {
			// 		chain: {
			// 			orderBy: {
			// 				timestamp: "asc",
			// 			},
			// 		},
			// 	},
			// });

			return chain;
		}),
});
