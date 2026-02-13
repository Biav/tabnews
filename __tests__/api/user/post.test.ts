import user from "pages/api/v1/user";
import orchestrator from "src/tests/orchestrator";

beforeAll(async () => {
  await orchestrator.awaitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPedingMigrations();
});

describe("POST /api/user", () => {
  it("should create a new user", async () => {
    const baseUrl = process.env.API_URL || "http://localhost:3000";
    const userMock = {
      user_name: "Felipe",
      email: "felipedeschamps@gmail",
      password: "12345678",
    };
    const response = await fetch(`${baseUrl}/api/v1/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userMock),
    });

    expect(response.status).toBe(201);

    const createdUser = await response.json();

    expect(createdUser.message).toMatchObject({
      user_name: userMock.user_name,
      email: userMock.email,
    });
  });
});
