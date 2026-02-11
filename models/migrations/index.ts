import { runner as migrationRunner } from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

async function runMigrations(dryRun: boolean) {
  const dbClient = await database.getNewClient();

  try {
    const migrationsResult = await migrationRunner({
      databaseUrl: dbClient,
      dryRun,
      dir: join(process.cwd(), "infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });

    return migrationsResult;
  } finally {
    await dbClient.end();
  }
}

export default runMigrations;
