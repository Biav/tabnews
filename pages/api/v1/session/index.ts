import { controller } from "infra/controller";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { getAuthenticatedUser } from "models/authentication";
import { sessionService } from "models/session";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(session);

async function session(req: NextApiRequest, res: NextApiResponse) {
  const { user_name, password } = req.body;
  const authenticatedUser = await getAuthenticatedUser(user_name, password);

  if (!authenticatedUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const session = await sessionService.create(authenticatedUser.id);

  try {
    controller.setSessionCookie(session, res);
  } catch (error) {
    console.error("Error setting cookie:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.status(201).json(session);
}

export default router.handler(controller as any);
