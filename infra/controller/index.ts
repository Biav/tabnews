import { InternalServerError, MethodNotAllowed } from "infra/errors";
import type { NextApiRequest, NextApiResponse } from "next";

function onNoMatchHandler(req: NextApiRequest, res: NextApiResponse) {
  const responseError = new MethodNotAllowed();
  res.status(responseError.statusCode).json(responseError);
}

function onErrorHandler(err: Error, req: NextApiRequest, res: NextApiResponse) {
  const cause = err;

  const responseError = new InternalServerError({ cause });

  return res.status(responseError.statusCode).json(responseError);
}

export const controller = {
  onError: onErrorHandler,
  onNoMatch: onNoMatchHandler,
};
