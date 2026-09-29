import { controller } from "infra/controller";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { getAuthenticatedUser } from "models/authentication";
import { sessionService } from "models/session";
import { stringifySetCookie } from "cookie";

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
    const cookie = stringifySetCookie({
      name: "sid",
      value: session.token,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expires_at,
    });

    res.setHeader("Set-Cookie", cookie);
  } catch (error) {
    console.error("Error setting cookie:", error);
    return res.status(500).json({ message: "Internal server error" });
  }

  return res.status(201).json(session);
}

export default router.handler(controller as any);
