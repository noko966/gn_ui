import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "bun:test";

// Set up a DOM environment for testing
import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();

// Clean up after each test
afterEach(() => {
    cleanup();
});
