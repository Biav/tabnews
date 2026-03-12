import orchestrator from "src/tests/orchestrator";

beforeAll(async () => {
  await orchestrator.awaitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPedingMigrations();
});

describe("POST /api/user", () => {
  describe("Anonymous user", () => {
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

    it("should not create a new user with an existing email", async () => {
      const baseUrl = process.env.API_URL || "http://localhost:3000";
      const userMock = {
        user_name: "Felipe1",
        email: "felipedeschamps@gmail.com",
        password: "12345678",
      };
      const response1 = await fetch(`${baseUrl}/api/v1/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userMock),
      });

      expect(response1.status).toBe(201);

      const response2 = await fetch(`${baseUrl}/api/v1/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userMock,
          user_name: "Felipe1",
          email: "felipedeschamps@gmail.com",
        }),
      });

      expect(response2.status).toBe(409);
    });
  });
});
