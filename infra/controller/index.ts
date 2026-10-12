import {
  InternalServerError,
  MethodNotAllowed,
  UniqueConstraintError,
  UnauthorizedError,
} from "infra/errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { stringifySetCookie } from "cookie";

type PgError = Error & {
  code?: string;
};

function onNoMatchHandler(req: NextApiRequest, res: NextApiResponse) {
  const responseError = new MethodNotAllowed();
  res.status(responseError.statusCode).json(responseError);
}

function onErrorHandler(
  err: PgError,
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cause = err;

  if ((err as any)?.code === "23505") {
    const uniqueError = new UniqueConstraintError(err);
    return res.status(uniqueError.statusCode).json(uniqueError);
  }

  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).json(err);
  }

  const responseError = new InternalServerError({ cause });

  return res.status(responseError.statusCode).json(responseError);
}

function setSessionCookie(session: any, res: NextApiResponse) {
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
}

export const controller = {
  onError: onErrorHandler,
  onNoMatch: onNoMatchHandler,
  setSessionCookie,
};
