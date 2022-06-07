import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Link } from "@prisma/client";
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
    case "PUT":
      const data: Link = req.body;
      const link = await prisma.link.update({
        where: { id: linkId },
        data,
      });
      
      res.status(200).json(link);
      break;
    case "DELETE":
      await prisma.link.delete({
        where: {
          id: linkId,
        },
      });
      res.status(200).json({});
      break;
  }
}
