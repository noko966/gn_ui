import { expect, test } from "bun:test";
import { Button } from "../src/lib/components/Button/Button";

test("Button component exports correctly", () => {
    expect(Button).toBeDefined();
    expect(typeof Button).toBe("function");
});
