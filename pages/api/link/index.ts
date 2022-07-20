import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Link, Tag } from "@prisma/client";
import { checkAuth } from "../check";
import { LinkApiResponse } from "../../../src/apiTypes";

export type PostPutData = {
  link: {
    title: string;
    url: string;
  };
  tags: Array<Tag>;
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LinkApiResponse | LinkApiResponse[] | { error: string }>
) {
  switch (req.method) {
    case "GET":
      if (!checkAuth(req, "READ")) {
        res.status(401).json({ error: "Unauthorized" });
        break;
      }
      const links = await prisma.link.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      res.status(200).json(links);
      break;
    case "POST":
      if (!checkAuth(req, "WRITE")) {
        res.status(401).json({ error: "Unauthorized" });
        break;
      }
      const { link, tags }: PostPutData = req.body;

      const newLink = await prisma.link.create({
        data: link,
      });

      const allTags = await Promise.all(
        tags.map(async (t) => {
          const tag = await prisma.tag.findFirst({
            where: {
              name: {
                equals: t.name,
              },
            },
          });
          if (tag) return tag;

          return await prisma.tag.create({
            data: {
              name: t.name,
            },
          });
        })
      );

      await Promise.all(
        tags.map(({ id }) => {
          return prisma.tagOnLink.create({
            data: {
              linkId: newLink.id,
              tagId: id,
            },
          });
        })
      );

      res
        .status(200)
        .json({ ...newLink, tags: allTags.map((t) => ({ tag: t })) });
      break;
  }
}
