import { createRouter, publicProcedure } from "../trpc";
import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { desc, eq } from "drizzle-orm";
import { link } from "../../db/schema";
import { z } from "zod";

export const publicRouter = createRouter({
	getChain: publicProcedure
		.input(
			z.object({
				username: z.string(),
			})
		)
		.query(async ({ input, ctx }) => {
			const connection = connect({
				host: process.env["DATABASE_HOST"],
				username: process.env["DATABASE_USERNAME"],
				password: process.env["DATABASE_PASSWORD"],
			});

			const db = drizzle(connection);

			try {
				const links = await db.select().from(link);
				console.log(links);
				//const links = await ctx.drizzle.select().from(link);
				//console.log(links);
			} catch (e) {
				console.log(e);
			}
			// const chain = await ctx.drizzle
			// 	.select()
			// 	.from(link)
			// 	.where(eq(link.username, input.username))
			// 	.orderBy(desc(link.timestamp))
			// 	.execute();

			// return chain;
		}),
});
