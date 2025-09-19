import { render } from "@testing-library/react";
import { expect, test } from "bun:test";
import React from "react";
import { Button } from "../src/lib/components/Button/Button";
import "./setup.js";

test("Button renders correctly", () => {
    const { getByText } = render(
        <React.Fragment>
            <Button text="Click Me" />
        </React.Fragment>
    );
    const buttonElement = getByText(/Click Me/i);
    expect(buttonElement).toBeInTheDocument();
});
