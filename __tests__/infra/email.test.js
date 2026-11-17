import orchestrator from "src/tests/orchestrator";
import email from "infra/email";

beforeAll(async () => {
  await orchestrator.awaitForAllServices();
});

describe("test email", () => {
  it("should send email", async () => {
    await email.send({
      from: "Teste",
      to: "test@example.com",
      subject: "Teste",
      html: "<p>Teste</p>",
    });

    const lastEmail = await orchestrator.getLastEmail();
    console.log("lastEmail", lastEmail);
    expect(lastEmail.subject).toBe("Teste");
    expect(lastEmail.recipients).toContain("<test@example.com>");
  });
});
