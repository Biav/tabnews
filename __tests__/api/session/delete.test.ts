import orchestrator from "src/tests/orchestrator";
import UserBuilder from "@/tests/builders/users/user.builder";

beforeAll(async () => {
  await orchestrator.awaitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPedingMigrations();
});

describe("DELETE /api/session", () => {
  describe("Anonymous user", () => {
    it("should delete a session when provided with a valid session token", async () => {
      const baseUrl = process.env.API_URL || "http://localhost:3000";
      const userMock = new UserBuilder().build();
      const userCreated = await orchestrator.createUser({ ...userMock });
      const createdSession = await orchestrator.createSession(userCreated.id);

      const response = await fetch(`${baseUrl}/api/v1/session`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `sid=${createdSession.token}`,
        },
      });

      const responseBody = await response.json();
      const sessionCookie = response.headers.getSetCookie();

      expect(response.status).toBe(200);
      expect(responseBody.id).toBe(createdSession.id);
      expect(new Date(responseBody.expires_at).getTime()).toBe(
        new Date(createdSession.expires_at).setFullYear(
          new Date(createdSession.expires_at).getFullYear() - 1,
        ),
      );
      expect(sessionCookie).toContain("sid=; Path=/; HttpOnly; SameSite=Lax");
    });

    it("should not delete a session when provided with an invalid session token", async () => {
      const baseUrl = process.env.API_URL || "http://localhost:3000";

      const response = await fetch(`${baseUrl}/api/v1/session`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `sid=invalid_token`,
        },
      });

      const responseBody = await response.json();

      expect(response.status).toBe(401);
      expect(responseBody.message).toBe("Invalid or expired session");
    });
  });
});
