import { createRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { parse } from "parse5";
import { Element } from "parse5/dist/tree-adapters/default";

const getOgProperties = (url: string) => {
	return fetch(url)
		.then((res) => res.text())
		.then((data) => {
			const document = parse(data);
			const html = document.childNodes[1] as Element;
			const head = html.childNodes[0] as Element;
			const metaTags = head.childNodes.filter(
				(node) => node.nodeName === "meta"
			) as Element[];
			const ogTags = metaTags.filter((tag) =>
				tag.attrs.some(
					(attr) => attr.name === "property" && attr.value.startsWith("og:")
				)
			) as Element[];
			const ogProperties = ogTags.map((tag) => {
				const content = tag.attrs.find(
					(attr) => attr.name === "content"
				)?.value;
				const property = tag.attrs
					.find((attr) => attr.name === "property")
					?.value.slice(3)!;
				return { [property]: content };
			});
			return ogProperties;
		});
};

export const protectedRouter = createRouter({
	addToChain: protectedProcedure
		.input(
			z.object({
				url: z.string(),
				notes: z.string().nullable(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const ogProperties = await getOgProperties(input.url);

			console.log(ogProperties);

			const response = await ctx.prisma.link.create({
				data: {
					url: input.url,
					notes: input.notes,
					username: ctx.session.user.username,
				},
			});

			return response;
		}),
	getOGProperties: protectedProcedure
		.input(z.object({ url: z.string() }))
		.query(async ({ input }) => {
			const ogProperties = await getOgProperties(input.url);
			console.log(ogProperties);

			return ogProperties;
		}),
});
