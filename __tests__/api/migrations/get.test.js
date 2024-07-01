describe("Should test migrations endpoint", () => {
  it("GET /api/migrations/v1", async () => {
    const response = await fetch("http://localhost:3000/api/migrations/v1");

    const responseBody = await response.json();
    console.log(responseBody);

    expect(response.status).toBe(200);
    expect(Array.isArray(responseBody)).toBe(true);
  });
});
