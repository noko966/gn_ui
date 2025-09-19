// Set up a DOM environment for testing
import { GlobalRegistrator } from "@happy-dom/global-registrator";
GlobalRegistrator.register();

// Defensive fallback: if register() didn't create a global document/window
// (some test runners or environments may isolate modules), create one using
// happy-dom's Window implementation.
if (typeof globalThis.document === "undefined") {
    try {
        const { Window } = await import("happy-dom");
        const win = new Window();
        globalThis.window = win;
        globalThis.document = win.document;
        // Common globals used by DOM libraries
        globalThis.HTMLElement = win.HTMLElement;
        globalThis.Node = win.Node;
        globalThis.getComputedStyle = win.getComputedStyle.bind(win);
    } catch (e) {
        // If dynamic import fails, fallback silently; tests will surface errors.
        // eslint-disable-next-line no-console
        console.warn("Could not create happy-dom Window fallback:", e.message || e);
    }
}

import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "bun:test";

// Clean up after each test
afterEach(() => {
    cleanup();
});
