import {
  InternalServerError,
  MethodNotAllowed,
  UniqueConstraintError,
} from "infra/errors";
import type { NextApiRequest, NextApiResponse } from "next";

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

  const responseError = new InternalServerError({ cause });

  return res.status(responseError.statusCode).json(responseError);
}

export const controller = {
  onError: onErrorHandler,
  onNoMatch: onNoMatchHandler,
};
