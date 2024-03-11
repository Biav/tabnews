import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import "@testing-library/jest-dom";

describe("initial test", () => {
  test("check if home is rendering", () => {
    render(<Home />);
    expect(screen.getByTestId("text")).toBeInTheDocument();
  });
});
