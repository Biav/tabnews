import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  const methodsAlloweds = ["GET", "POST"];

  if (!methodsAlloweds.includes(request.method)) {
    return response.status(405).json("Method not allowed");
  }

  const dryRun = request.method === "POST" ? true : false;

  const migrations = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dryRun,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: "true",
    migrationsTable: "pgmigrations",
  });

  response.status(200).json(migrations);
}
