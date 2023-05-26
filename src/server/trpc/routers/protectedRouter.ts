import { createRouter, protectedProcedure } from "../trpc";
import { link } from "../../db/schema";
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

			const ogTitle = ogProperties.find((prop) => prop.title)?.title;
			const ogSiteName = ogProperties.find((prop) => prop.site_name)?.site_name;
			const ogDescription = ogProperties.find(
				(prop) => prop.description
			)?.description;
			const ogImage = ogProperties.find((prop) => prop.image)?.image;

			return { ogTitle, ogSiteName, ogDescription, ogImage };
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
			const { ogTitle, ogSiteName, ogDescription, ogImage } =
				await getOgProperties(input.url);

			const response = await ctx.drizzle.insert(link).values({
				url: input.url,
				notes: input.notes,
				ogTitle,
				ogSiteName,
				ogDescription,
				ogImage,
				username: ctx.session.user.username,
				// timestamp: new Date(),
			});

			return response;
		}),
});
