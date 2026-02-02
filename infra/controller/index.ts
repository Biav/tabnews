import { InternalServerError } from "infra/errors";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextHandler } from "next-connect";

function onErrorHandler(
  err: Error,
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler,
) {
  const cause = err;

  const responseError = new InternalServerError({ cause });

  return res.status(responseError.statusCode).json(responseError.toJSON());
}

export const controller = {
  onError: onErrorHandler,
};
