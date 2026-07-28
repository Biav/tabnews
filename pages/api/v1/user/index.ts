import { controller } from "infra/controller";
import { ValidationError } from "infra/errors";
import { userService } from "models/user";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(user);

async function user(req: NextApiRequest, res: NextApiResponse) {
  const response = await userService.createUser(req.body);

  if (response instanceof ValidationError) {
    return res.status(response.statusCode).json(response.toJSON());
  }

  return res.status(201).json({ message: response });
}

export default router.handler(controller as any);
