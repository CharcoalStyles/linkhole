import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { checkAuth } from "./check";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (!checkAuth(req, "READ")) {
    res.status(401).json({});
    return;
  }

  switch (req.method) {
    case "GET":
      const tags = await prisma.tag.findMany({
        orderBy: {
          links: {
            _count: "desc",
          },
        },
      });

      res.status(200).json(tags);
  }
}
