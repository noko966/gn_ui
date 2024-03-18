import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "../../library/global.css";
import "../../library/variables.css";
import "../../library/fonts.css";
import "./ui.css";

import { Button, Input, Event } from "../../library/digi-library.js";

// import hljs from "highlight.js";
// import javascript from "highlight.js/lib/languages/javascript";
// import "highlight.js/styles/github-dark-dimmed.css";

// hljs.registerLanguage("javascript", javascript);

const App = () => {
  // useEffect(() => {
  //   document.querySelectorAll("pre code").forEach((block) => {
  //     hljs.highlightBlock(block);
  //   });
  // }, []);
  return (
    <Router>
      <div className="CL_UI_root">
        <aside className="CL_UI_aside_root">
          <div className="CL_UI_root_logo"></div>
          <h3>Ui Library Digi</h3>
          <div className="CL_UI_aside_links">
            <Link to="/">Docs</Link>
            <Link to="/button">Button</Link>
            <Link to="/input">Input</Link>
            <Link to="/event">Event</Link>
          </div>
        </aside>
        <main className="CL_UI_main_root">
          <div className="CL_UI_presentation_root">
            <div className="CL_UI_component_preview_root">
              <Routes>
                <Route path="/" element={<div>G N UI presentation Lib</div>} />
                <Route
                  path="/button"
                  element={<Button title="regular button">button</Button>}
                />
                <Route
                  path="/event"
                  element={
                    <>
                      <Event />
                      <Event />
                      <Event />
                      <Event />
                      <Event />
                      <Event />
                      <Event />
                      <Event />
                    </>
                  }
                />
                <Route
                  path="/input"
                  element={<Input placeholder={"placeholder"} />}
                />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
