import { scan } from "react-scan/all-environments";
/*       ^^^^ must be imported before react and react-dome */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./builder-app";

import "./assets/index.css";

scan({
    enabled: true,
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
