import crypto from "node:crypto";
import database from "infra/database";
import { UnauthorizedError } from "infra/errors";
const EXPIRATION_30_DAYS = 1000 * 60 * 60 * 24 * 30; // 30 days

async function create(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_30_DAYS); // 30 days

  const session = await database.query({
    text: "INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *",
    values: [userId, token, expiresAt],
  });

  return session.rows[0];
}

async function validateSession(token: string) {
  const session = await database.query({
    text: "SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()",
    values: [token],
  });

  if (session.rows.length === 0) {
    throw new UnauthorizedError({
      cause: new Error("Invalid or expired session"),
    });
  }

  return session.rows[0];
}

async function renew(userId: string) {
  const newExpiresAt = new Date(Date.now() + EXPIRATION_30_DAYS); // 30 days

  const updatedSession = await database.query({
    text: "UPDATE sessions SET expires_at = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *",
    values: [newExpiresAt, userId],
  });

  return updatedSession.rows[0];
}

export const sessionService = {
  create,
  validateSession,
  renew,
};
