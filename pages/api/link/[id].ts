import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Link, Tag } from "@prisma/client";
import { checkAuth } from "../check";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const linkId = Number.parseInt(req.query.id as string);

  if (!checkAuth(req, "WRITE")) {
    res.status(401).json({});
    return;
  }

  switch (req.method) {
    case "GET":
      const thisLink = await prisma.link.findFirst({
        where: {
          id: linkId,
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      res.status(200).json(thisLink);
      break;
    case "PUT":
      const {
        link,
        tags,
      }: {
        link: { title: string; url: string };
        tags: { old: Array<Tag>; new: Array<Tag> };
      } = req.body;

      const realNewTags = tags.new.filter((t) => t.id === -1);

      await Promise.all(
        realNewTags.map((t) => {
          return prisma.tag.create({
            data: {
              name: t.name,
              links: {
                create: {
                  linkId,
                },
              },
            },
          });
        })
      );

      const updatedTagIds = tags.new
        .filter((t) => t.id !== -1)
        .map((t) => t.id);

      const oldTagIds = tags.old.map((t) => t.id);

      await Promise.all(
        updatedTagIds
          .filter((ut) => !oldTagIds.includes(ut))
          .map((t) => prisma.tagOnLink.create({
              data: {
                tagId: t,
                linkId,
              },
            });
          )
      );

      await Promise.all(
        oldTagIds
          .filter((ut) => !updatedTagIds.includes(ut))
          .map((t) => 
            prisma.tagOnLink.delete({
              where: {
                linkId_tagId: {
                  linkId,
                  tagId: t,
                },
              },
            });
          )
      );

      const newLink = await prisma.link.update({
        where: { id: linkId },
        data: {
          title: link.title,
          url: link.url,
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      res.status(200).json(newLink);
      break;
    case "DELETE":
      await prisma.link.delete({
        where: {
          id: linkId,
        },
      });

      await prisma.tagOnLink.deleteMany({
        where: {
          linkId,
        },
      });

      res.status(200).json({});
      break;
  }
}
