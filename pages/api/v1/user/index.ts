import { controller } from "infra/controller";
import { ValidationError } from "infra/errors";
import { userService } from "models/user";
import { sessionService } from "models/session";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(user);
router.get(user);

async function getAuthenticatedUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sessionToken = req.cookies.sid || "";
    const validSession = await sessionService.validateSession(sessionToken);

    if (validSession.id) {
      const renewedSession = await sessionService.renew(validSession.user_id);
      const authenticatedUser = await userService.getUserById(
        validSession.user_id,
      );
      controller.setSessionCookie(renewedSession, res);

      return res.status(200).json({
        user: authenticatedUser,
        session: renewedSession,
      });
    }
  } catch (error) {
    console.error("Error validating session:", error);
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

async function user(req: NextApiRequest, res: NextApiResponse) {
  const methodsAlloweds = ["GET", "POST"];

  if (!methodsAlloweds.includes(req.method || "")) {
    return res.status(405).json("Method not allowed");
  }

  if (req.method === "GET") {
    return getAuthenticatedUser(req, res);
  }

  const response = await userService.createUser(req.body);

  if (response instanceof ValidationError) {
    return res.status(response.statusCode).json(response.toJSON());
  }

  return res.status(201).json({ message: response });
}

export default router.handler(controller as any);
