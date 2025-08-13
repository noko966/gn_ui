// import { createRoot } from "react-dom/client";
// import React from "react";
// import ReactDOM from "react-dom";
// import BuilderApp from "./builderApp.js";
// ReactDOM.render(<BuilderApp />, document.getElementById("root"));


import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./builderComponents/store";
import { TreeEditor } from "./builderComponents/TreeEditor";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <TreeEditor />
    </Provider>
);
