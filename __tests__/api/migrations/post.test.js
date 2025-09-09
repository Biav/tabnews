import database from "infra/database";
import { awaitForAllServices } from "src/tests/orchestrator";

beforeAll(async () => {
  await cleanSchema();
  await awaitForAllServices();
}, 60000);

async function cleanSchema() {
  await database.query("drop schema public cascade; create schema public;");
}

describe("Should test migrations endpoint", () => {
  it("POST /api/migrations/v1", async () => {
    const response = await fetch("http://localhost:3000/api/migrations/v1", {
      method: "POST",
    });

    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody.length).toBeGreaterThan(0);

    const response2 = await fetch("http://localhost:3000/api/migrations/v1", {
      method: "POST",
    });

    const responseBody2 = await response2.json();

    expect(response2.status).toBe(200);
    expect(responseBody2.length).toBe(0);
  });
});
