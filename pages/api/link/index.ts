import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Link, Tag } from "@prisma/client";
import { checkAuth } from "../check";

export type PostPutData = {
  link: {
    title: string;
    url: string;
  };
  tags: Array<string>;
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Link | Link[] | { error: string }>
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

      const tagIds = await Promise.all(
        tags.map(async (t) => {
          const tag = await prisma.tag.findFirst({
            where: {
              name: {
                equals: t,
              },
            },
          });
          if (tag) return tag?.id;

          return (
            await prisma.tag.create({
              data: {
                name: t,
              },
            })
          ).id;
        })
      );

      await Promise.all(
        tagIds.map((tid) => {
          return prisma.tagOnLink.create({
            data: {
              linkId: newLink.id,
              tagId: tid,
            },
          });
        })
      );

      res.status(200).json(newLink);
      break;
  }
}
