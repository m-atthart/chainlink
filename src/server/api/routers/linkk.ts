/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { linkks, users } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";

import { parse } from "parse5";
import type { Element } from "../../../../node_modules/parse5/dist/tree-adapters/default";

const getOgProperties = (url: string) => {
  return fetch(url)
    .then((res) => res.text())
    .then((data) => {
      const document = parse(data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const html = document.childNodes[1] as Element;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const head = html.childNodes[0] as Element;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const metaTags = head.childNodes.filter(
        (node: { nodeName: string }) => node.nodeName === "meta",
      ) as Element[];
      const ogTags = metaTags.filter((tag) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        tag.attrs.some(
          (attr: { name: string; value: string }) =>
            attr.name === "property" && attr.value.startsWith("og:"),
        ),
      );
      const ogProperties: {
        title?: string;
        site_name?: string;
        description?: string;
        image?: string;
      }[] = ogTags.map((tag) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const content = tag.attrs.find(
          (attr: { name: string }) => attr.name === "content",
        )?.value;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-non-null-asserted-optional-chain
        const property = tag.attrs
          .find((attr: { name: string }) => attr.name === "property")
          ?.value.slice(3)!;
        return { [property]: content };
      });

      const ogTitle = ogProperties.find((prop) => prop.title)?.title;
      const ogSiteName = ogProperties.find((prop) => prop.site_name)?.site_name;
      const ogDescription = ogProperties.find(
        (prop) => prop.description,
      )?.description;
      const ogImage = ogProperties.find((prop) => prop.image)?.image;

      return { ogTitle, ogSiteName, ogDescription, ogImage } as {
        ogTitle: string;
        ogSiteName: string;
        ogDescription: string;
        ogImage: string;
      };
    });
};

export const linkkRouter = createTRPCRouter({
  getChain: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const joinedChain = await ctx.db
        .select()
        .from(users)
        .leftJoin(linkks, eq(users.id, linkks.authorId))
        .where(eq(users.name, input.username))
        .orderBy(desc(linkks.timestamp));

      // subquery version
      `select * from chainlinkk_linkk where exists (
        select id from chainlinkk_user where chainlinkk_user.name = "matthartdev" and chainlinkk_linkk.authorId = id
      );`;

      const chain = joinedChain.map((joinedLinkk) => {
        return joinedLinkk.linkk;
      });

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

      const response = await ctx.db.insert(linkks).values({
        url: input.url,
        notes: input.notes,
        ogTitle,
        ogSiteName,
        ogDescription,
        ogImage,
        authorId: ctx.session.user.id,
        timestamp: new Date(),
      });

      console.log(response);

      return 201;
    }),
});
