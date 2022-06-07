import type { NextApiRequest, NextApiResponse } from "next";

export const checkAuth = (req: NextApiRequest, type: "READ" | "WRITE" | "") => {
  if (type === "") {
    return false;
  }
  const auth = req.headers.authorization ? req.headers.authorization : "";
  const password = process.env[`${type}_PASSWORD`]
    ? process.env[`${type}_PASSWORD`]
    : "";

  return auth === password;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  const auth = checkAuth(
    req,
    req.method === "GET" ? "READ" : req.method === "POST" ? "WRITE" : ""
  );
  switch (req.method) {
    case "GET":
      res.status(auth ? 200 : 401).json({});
      break;
    case "POST":
      res.status(auth ? 200 : 401).json({});
      break;
  }
}
