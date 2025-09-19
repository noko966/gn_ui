import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "bun:test";
import { Button } from "../src/lib/components/Button/Button";
import "./setup.js";

test("Button renders correctly", () => {
    render(<Button text="Click Me" />);
    const buttonElement = screen.getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
});
