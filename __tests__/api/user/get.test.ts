import UserBuilder from "@/tests/builders/users/user.builder";
import orchestrator from "src/tests/orchestrator";

beforeAll(async () => {
  await orchestrator.awaitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPedingMigrations();
});

describe("GET /api/user", () => {
  describe("valid sessions", () => {
    it("should renew session", async () => {
      const baseUrl = process.env.API_URL || "http://localhost:3000";
      const userMock = new UserBuilder().build();
      const userCreated = await orchestrator.createUser(userMock);
      const session = await orchestrator.createSession(userCreated.id);

      const validSession = await fetch(`${baseUrl}/api/v1/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `sid=${session.token}`,
        },
      });

      const validSessionJson = await validSession.json();

      expect(validSession.status).toBe(200);
      expect(validSessionJson.session).toMatchObject({
        id: session.id,
        user_id: session.user_id,
        token: session.token,
        created_at: session.created_at.toISOString(),
        updated_at: expect.any(String),
        expires_at: expect.any(String),
      });

      expect(Date.parse(validSessionJson.session.updated_at)).not.toBeNaN();
      expect(Date.parse(validSessionJson.session.expires_at)).toBeGreaterThan(
        new Date().getTime(),
      );
      expect(validSessionJson.user).toMatchObject({
        user_name: userCreated.user_name,
        email: userCreated.email,
      });

      const setCookies = validSession.headers.getSetCookie();

      expect(setCookies).toHaveLength(1);
      expect(setCookies[0]).toContain(`sid=${validSessionJson.session.token}`);
      const expiresAt = new Date(
        validSessionJson.session.expires_at,
      ).toUTCString();

      expect(setCookies[0]).toContain(`Expires=${expiresAt}`);
      expect(setCookies[0]).toContain("Path=/");
      expect(setCookies[0]).toContain("HttpOnly");
    });
  });
});
