describe("Status api", () => {
  test("GET /api/status/v1 should return 200", async () => {
    const response = await fetch("http://localhost:3000/api/status/v1");

    const result = await response.json();
    const dateUpdated = new Date(result.update_at);
    const isValidDate = !isNaN(dateUpdated.getTime());

    expect(isValidDate).toBeTruthy();
    expect(result.version).toBe("16.2");
    expect(result.maxConnections).toBe(100);
    expect(result.openedConnections).toBe(1);
  });
});
