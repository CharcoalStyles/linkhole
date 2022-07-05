import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { checkAuth } from "./check";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  const auth = checkAuth(req, "READ");
  switch (req.method) {
    case "GET":
      const tags = await prisma.tag.findMany({
        include: {
          links: {
            include: {
              link: true,
            }
          },
        },
      });

      res
        .status(200)
        .json(
          tags
            .sort((a, b) => a.links.length - b.links.length)
        );
  }
}
