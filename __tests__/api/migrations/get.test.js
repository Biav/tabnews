import database from "infra/database";
import orchestrator from "src/tests/orchestrator";

beforeAll(async () => {
  await orchestrator.awaitForAllServices();
  await cleanSchema();
}, 60000);

async function cleanSchema() {
  await database.query("drop schema public cascade; create schema public;");
}

describe("GET /api/migrations/v1", () => {
  it("Should get the migrations", async () => {
    const response = await fetch("http://localhost:3000/api/migrations/v1");

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.length).toBeGreaterThan(0);
  });
});
