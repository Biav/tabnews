import { NextApiRequest, NextApiResponse } from "next";
import { userService } from "../../../../models/user";

async function username(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;

  const user = await userService.getUserByUserName(username as string);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
}

export default username;
