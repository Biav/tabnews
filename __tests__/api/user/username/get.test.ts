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
    const userMock = new UserBuilder().build();

    await orchestrator.createUser(userMock);

    const response = await fetch(
      `${baseUrl}/api/v1/user/${userMock.user_name}`,
    );

    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.user_name).toEqual(userMock.user_name);
  });

  it("should return a 404 error if the user does not exist", async () => {
    const baseUrl = process.env.API_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/v1/user/nonexistent`);

    expect(response.status).toBe(404);
  });
});
