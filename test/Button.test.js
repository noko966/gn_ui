import { render } from "@testing-library/react";
import { expect, test } from "bun:test";
import { Button } from "../src/lib/components/Button/Button";
import "./setup.js";

test("Button renders correctly", () => {
    const { getByText } = render(<Button text="Click Me" />);
    const buttonElement = getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
});
