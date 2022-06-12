import type { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "query-string";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  console.log("SHARE");
  console.log("req.body", req.body);
  console.log("req.query", req.query);
  const newQ = stringify(req.query);

  res.status(307).redirect(`../../?${newQ}`);
}
