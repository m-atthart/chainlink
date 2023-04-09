import { createLegacyRouter } from "../index";
import { z } from "zod";

export const exampleRouter = createLegacyRouter()
	.query("getChain", {
		input: z.object({
			username: z.string(),
		}),
		async resolve({ input, ctx }) {
			console.log("getChain");
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
