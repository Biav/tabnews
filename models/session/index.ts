import crypto from "node:crypto";
import database from "infra/database";

const EXPIRATION_30_DAYS = 1000 * 60 * 60 * 24 * 30; // 30 days

async function create(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_30_DAYS); // 30 days

  const session = await database.query({
    text: "INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING *",
    values: [userId, token, expiresAt],
  });

  console.log("Session created:", session.rows[0]);
  return session.rows[0];
}

export const sessionService = {
  create,
};
