import database from "infra/database";

beforeAll(async () => {
  await cleanSchema();
});

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
