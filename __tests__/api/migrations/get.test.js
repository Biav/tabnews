import database from "infra/database";
import { awaitForAllServices } from "src/tests/orchestrator";

beforeAll(async () => {
  await awaitForAllServices();
  await cleanSchema();
}, 60000);

async function cleanSchema() {
  await database.query("drop schema public cascade; create schema public;");
}

describe("Should test migrations endpoint", () => {
  it("GET /api/migrations/v1", async () => {
    const response = await fetch("http://localhost:3000/api/migrations/v1");

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.length).toBeGreaterThan(0);
  });
});
