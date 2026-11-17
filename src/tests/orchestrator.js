import retry from "async-retry";
import runMigrations from "models/migrations";
import database from "infra/database";
import { userService } from "models/user";
import { sessionService } from "models/session";

const urlEmail = `http://${process.env.EMAIL_HTTP_HOST}:${process.env.EMAIL_HTTP_PORT}`;

async function awaitForAllServices() {
  await awaitToDb();
  await awaitToEmail();

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

  function awaitToEmail() {
    return retry(
      //eslint-disable-next-line
      async (bail) => {
        const res = await fetch(`${urlEmail}/messages`);
        if (!res.ok) {
          throw new Error("Email service not ready");
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

async function createSession(userId) {
  const session = await sessionService.create(userId);
  return session;
}

async function getLastEmail() {
  const res = await fetch(`${urlEmail}/messages`);
  const data = await res.json();
  return data[data.length - 1];
}

const orchestrator = {
  awaitForAllServices,
  clearDatabase,
  runPedingMigrations,
  createUser,
  createSession,
  getLastEmail,
};

export default orchestrator;
