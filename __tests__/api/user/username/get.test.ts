import orchestrator from "src/tests/orchestrator";
import UserBuilder from "src/tests/builders/users/user.builder";

beforeAll(async () => {
  await orchestrator.awaitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPedingMigrations();
});

describe("GET /api/username", () => {
  it("should return a user that exists on the database", async () => {
    const baseUrl = process.env.API_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/v1/user/felipe`);

    const userMock = new UserBuilder().build();

    const createdUser = await fetch(`${baseUrl}/api/v1/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userMock),
    });

    expect(createdUser.status).toBe(201);

    expect(response.status).toBe(200);
  });
});
