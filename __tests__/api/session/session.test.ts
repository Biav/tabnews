import orchestrator from "src/tests/orchestrator";
import UserBuilder from "@/tests/builders/users/user.builder";

beforeAll(async () => {
  await orchestrator.awaitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPedingMigrations();
});

describe("POST /api/session", () => {
  describe("Anonymous user", () => {
    it("should not create a new session when user_name is invalid", async () => {
      const baseUrl = process.env.API_URL || "http://localhost:3000";
      const userMock = new UserBuilder().build();
      await orchestrator.createUser({ ...userMock });

      const response = await fetch(`${baseUrl}/api/v1/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: "NewUser",
          password: userMock.password,
        }),
      });

      expect(response.status).toBe(401);
    });

    it("should not create a new session when password is invalid", async () => {
      const baseUrl = process.env.API_URL || "http://localhost:3000";
      const userMock = new UserBuilder().build();
      await orchestrator.createUser({ ...userMock });

      const response = await fetch(`${baseUrl}/api/v1/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: userMock.user_name,
          password: "wrongpassword",
        }),
      });

      expect(response.status).toBe(401);
    });

    it("should create a new session when user is valid", async () => {
      const baseUrl = process.env.API_URL || "http://localhost:3000";
      const userMock = new UserBuilder().build();
      await orchestrator.createUser({ ...userMock });

      const response = await fetch(`${baseUrl}/api/v1/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: userMock.user_name,
          password: userMock.password,
        }),
      });

      expect(response.status).toBe(201);
      const session = await response.json();
      expect(session).toMatchObject({
        user_id: expect.any(String),
        token: expect.any(String),
      });

      const setCookie = response.headers.get("set-cookie");
      expect(setCookie).toContain(`sid=${session.token}`);
      expect(setCookie).toContain("Path=/");
    });
  });
});
