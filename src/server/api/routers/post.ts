/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts, linkks } from "~/server/db/schema";

import { parse } from "parse5";
import type { Element } from "parse5/dist/tree-adapters/default";

const getOgProperties = (url: string) => {
  return fetch(url)
    .then((res) => res.text())
    .then((data) => {
      const document = parse(data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const html = document.childNodes[1] as Element;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const head = html.childNodes[0] satisfies Element;
      const metaTags = head.childNodes.filter(
        (node) => node.nodeName === "meta",
      ) as Element[];
      const ogTags = metaTags.filter((tag) =>
        tag.attrs.some(
          (attr) => attr.name === "property" && attr.value.startsWith("og:"),
        ),
      );
      const ogProperties = ogTags.map((tag) => {
        const content = tag.attrs.find((attr) => attr.name === "content")
          ?.value;
        const property = tag.attrs
          .find((attr) => attr.name === "property")
          ?.value.slice(3)!;
        return { [property]: content };
      });

      const ogTitle = ogProperties.find((prop) => prop.title)?.title;
      const ogSiteName = ogProperties.find((prop) => prop.site_name)?.site_name;
      const ogDescription = ogProperties.find((prop) => prop.description)
        ?.description;
      const ogImage = ogProperties.find((prop) => prop.image)?.image;

      return { ogTitle, ogSiteName, ogDescription, ogImage };
    });
};

export const postRouter = createTRPCRouter({
  getChain: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      // const chain = await ctx.prisma.link.findMany({
      // 	where: {
      // 		username: {
      // 			equals: input.username,
      // 		},
      // 	},
      // 	orderBy: {
      // 		timestamp: "desc",
      // 	},
      // });
      await ctx.db.query.linkks.findMany({
        orderBy: (linkks, { desc }) => [desc(linkks.timestamp)],
      });
      const chain = { data: [] };

      return chain;
    }),

  addToChain: protectedProcedure
    .input(
      z.object({
        url: z.string(),
        notes: z.string().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { ogTitle, ogSiteName, ogDescription, ogImage } =
        await getOgProperties(input.url);

      // const response = await ctx.prisma.link.create({
      //   data: {
      //     url: input.url,
      //     notes: input.notes,
      //     ogTitle,
      //     ogSiteName,
      //     ogDescription,
      //     ogImage,
      //     username: ctx.session.user.username,
      //     timestamp: new Date(),
      //   },
      // });

      const response = 200;

      return response;
    }),

  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
