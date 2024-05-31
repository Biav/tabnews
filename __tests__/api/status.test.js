describe("Status api", () => {
  test("GET /api/status/v1 should return 200", async () => {
    const response = await fetch("http://localhost:3000/api/status/v1");

    expect(response.status).toBe(200);
  });
});
