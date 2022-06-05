import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Link } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const linkId = Number.parseInt(req.query.id as string);

  const prisma = new PrismaClient();
  switch (req.method) {
    case "PUT":
      const data: Link = req.body;
      const link = await prisma.link.update({
        where: { id: linkId },
        data,
      });
      console.log({ linkId, data, link });
      res.status(200).json(link);
      break;
    case "DELETE":
      await prisma.link.delete({
        where: {
          id: linkId,
        },
      });
      res.status(200);
      break;
  }
}
