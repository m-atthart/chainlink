import { createRouter } from "./context";
import { z } from "zod";

export const exampleRouter = createRouter()
	.query("getChain", {
		input: z.object({
			username: z.string(),
		}),
		async resolve({ input, ctx }) {
			const response = await ctx.prisma.link.findMany({
				where: {
					username: {
						equals: input.username,
					},
				},
			});
			return response;
		},
	})
	.query("getUser", {
		input: z.object({
			username: z.string(),
		}),
		async resolve({ input, ctx }) {
			const response = await ctx.prisma.user.findUnique({
				where: {
					name: input.username,
				},
			});
			return response;
		},
	});
