import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Link } from "@prisma/client";
import { checkAuth } from "../check";

type PostData = {
  title: string;
  url: string;
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
          tags: true,
        },
      });
      res.status(200).json(links);
      break;
    case "POST":
      if (!checkAuth(req, "WRITE")) {
        res.status(401).json({ error: "Unauthorized" });
        break;
      }
      const data: PostData = req.body;
      const link = await prisma.link.create({
        data,
      });
      res.status(200).json(link);
      break;
  }
}
