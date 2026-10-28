import { controller } from "infra/controller";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { getAuthenticatedUser } from "models/authentication";
import { sessionService } from "models/session";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(session);
router.delete(deleteSession);

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

async function deleteSession(req: NextApiRequest, res: NextApiResponse) {
  const sessionToken = req.cookies.sid || "";

  try {
    const validSession = await sessionService.validateSession(sessionToken);
    console.log("Valid session:", validSession);

    if (!validSession.id) {
      return res.status(401).json({ message: "Invalid or expired session" });
    }
    const deletedSession = await sessionService.deleteSession(validSession.id);

    controller.clearSessionCookie(res);
    return res.status(200).json(deletedSession);
  } catch (error) {
    console.error("Error deleting session:", error);
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

export default router.handler(controller as any);
