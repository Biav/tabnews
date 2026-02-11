import { createRouter } from "next-connect";
import { controller } from "infra/controller";
import runMigrations from "models/migrations";

const router = createRouter();
router.get(migrations);
router.post(migrations);

async function migrations(request, response) {
  const methodsAlloweds = ["GET", "POST"];

  if (!methodsAlloweds.includes(request.method)) {
    return response.status(405).json("Method not allowed");
  }

  const dryRun = request.method === "POST" ? false : true;
  const migrations = await runMigrations(dryRun);

  if (request.method === "POST" && migrations.length > 0) {
    response.status(201).json(migrations);
  }

  response.status(200).json(migrations);
}

export default router.handler(controller);
