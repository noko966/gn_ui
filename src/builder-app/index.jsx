// import { createRoot } from "react-dom/client";
// import React from "react";
// import ReactDOM from "react-dom";
// import BuilderApp from "./builderApp.js";
// ReactDOM.render(<BuilderApp />, document.getElementById("root"));

import { Provider } from "react-redux";
import { TreeEditor } from "./features/TreeEditor";
import { store } from "./store";

export function App() {
    return (
        <Provider store={store}>
            <TreeEditor />
        </Provider>
    );
}
