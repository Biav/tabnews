import { NextApiRequest, NextApiResponse } from "next";

async function username(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ message: "User found" });
}

export default username;
