import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  const methodsAlloweds = ["GET", "POST"];

  if (!methodsAlloweds.includes(request.method)) {
    return response.status(405).json("Method not allowed");
  }

  const dryRun = request.method === "POST" ? false : true;

  const migrations = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dryRun,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: "true",
    migrationsTable: "pgmigrations",
  });

  if (request.method === "POST" && migrations.length > 0) {
    response.status(201).json(migrations);
  }

  response.status(200).json(migrations);
}
