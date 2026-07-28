import UserBuilder from "@/tests/builders/users/user.builder";
import orchestrator from "src/tests/orchestrator";
import {
  emailValidationError,
  passwordValidationError,
  usernameValidationError,
  missingFieldsError,
} from "infra/errors";

beforeAll(async () => {
  await orchestrator.awaitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPedingMigrations();
});

describe("POST /api/user", () => {
  describe("Anonymous user", () => {
    it("should create a new user", async () => {
      const baseUrl = process.env.API_URL || "http://localhost:3000";

      const userMock = new UserBuilder().build();

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

      const userMock = new UserBuilder().build();

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
          user_name: "NewUser1",
        }),
      });

      expect(response2.status).toBe(409);
    });

    it("should not create a new user with an existing username", async () => {
      const baseUrl = process.env.API_URL || "http://localhost:3000";

      const userMock = new UserBuilder().build();

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
          email: "NewUser1@gmail.com",
        }),
      });

      expect(response2.status).toBe(409);
    });
  });

  it("should not create a new user with missing fields", async () => {
    const baseUrl = process.env.API_URL || "http://localhost:3000";

    const userMock = new UserBuilder().build();

    const response = await fetch(`${baseUrl}/api/v1/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userMock,
        email: "",
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(422);
    expect(responseBody.message).toBe(missingFieldsError("email"));
  });

  it("should not create a new user with a username shorter than 4 characters", async () => {
    const baseUrl = process.env.API_URL || "http://localhost:3000";

    const userMock = new UserBuilder().build();

    const response = await fetch(`${baseUrl}/api/v1/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userMock,
        user_name: "abc",
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(422);
    expect(responseBody.message).toBe(usernameValidationError(4));
  });

  it("should not create a new user with a password shorter than 10 characters", async () => {
    const baseUrl = process.env.API_URL || "http://localhost:3000";

    const userMock = new UserBuilder().build();

    const response = await fetch(`${baseUrl}/api/v1/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userMock,
        password: "short",
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(422);
    expect(responseBody.message).toBe(passwordValidationError(10));
  });

  it("should not create a new user with an invalid email format", async () => {
    const baseUrl = process.env.API_URL || "http://localhost:3000";

    const userMock = new UserBuilder().build();

    const response = await fetch(`${baseUrl}/api/v1/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userMock,
        email: "invalid-email-format",
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(422);
    expect(responseBody.message).toBe(emailValidationError());
  });
});
