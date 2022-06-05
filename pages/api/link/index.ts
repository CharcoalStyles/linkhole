import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Link } from "@prisma/client";

type PostData = {
  title: string;
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Link | Link[] | { error: string }>
) {
  const prisma = new PrismaClient();
  switch (req.method) {
    case "GET":
      const links = await prisma.link.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          tags: true,
        },
      });
      res.status(200).json(links);
      break;
    case "POST":
      const data: PostData = req.body;
      const link = await prisma.link.create({
        data,
      });
      res.status(200).json(link);
      break;
  }
}