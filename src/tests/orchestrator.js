import retry from "async-retry";
import runMigrations from "models/migrations";
import database from "infra/database";
import { userService } from "models/user";

async function awaitForAllServices() {
  await awaitToDb();

  function awaitToDb() {
    return retry(
      //eslint-disable-next-line
      async (bail) => {
        const res = await fetch(`${process.env.BASE_URL}/api/status/v1`);
        if (!res.ok) {
          throw new Error("Service not ready");
        }
        return res;
      },
      {
        retries: 10,
        maxTimeout: 1000,
      },
    );
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPedingMigrations() {
  await runMigrations();
}

async function createUser(userData) {
  return await userService.createUser(userData);
}

const orchestrator = {
  awaitForAllServices,
  clearDatabase,
  runPedingMigrations,
  createUser,
};

export default orchestrator;
