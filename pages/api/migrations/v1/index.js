import { runner as migrationRunner } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";
import { createRouter } from "next-connect";
import { controller } from "infra/controller";

const router = createRouter();
router.get(migrations);
router.post(migrations);

async function migrations(request, response) {
  const methodsAlloweds = ["GET", "POST"];

  if (!methodsAlloweds.includes(request.method)) {
    return response.status(405).json("Method not allowed");
  }

  const dryRun = request.method === "POST" ? false : true;
  const dbClient = await database.getNewClient();

  const migrations = await migrationRunner({
    databaseUrl: dbClient,
    dryRun,
    dir: join(process.cwd(), "infra", "migrations"),
    direction: "up",
    verbose: "true",
    migrationsTable: "pgmigrations",
  });

  if (request.method === "POST" && migrations.length > 0) {
    response.status(201).json(migrations);
  }

  await dbClient.end();

  response.status(200).json(migrations);
}

export default router.handler(controller);
