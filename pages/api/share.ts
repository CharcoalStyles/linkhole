import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  console.log("SHARE");
  console.log("req.body", req.body);
  console.log("req.query", req.query);

  const query = Object.keys(req.query).reduce((acc, key) => {
    const innerObj = req.query[key];

    if (typeof innerObj === "string") {
      acc += `${key}=${innerObj}&`;
    } else {
      innerObj.forEach((value) => {
        acc += `${key}=${value}&`;
      });
    }
    return acc;
  }, "?");

  res.status(307).redirect(`../../${query}`);
}
