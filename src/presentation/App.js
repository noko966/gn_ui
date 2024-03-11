import React from "react";
import "./styles/ui.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Button from "./components/Button";
import Input from "./components/Input";

const App = () => {
  return (
    <Router>
      <div className="CL_UI_root">
        <aside className="CL_UI_aside_root">
          <div className="CL_UI_root_logo">
            
          </div>
          <h3>Components</h3>
          <div className="CL_UI_aside_links">
            <Link to="/">Button</Link>
            <Link to="/input">Input</Link>
          </div>
        </aside>
        <main className="CL_UI_main_root">
          <div className="CL_UI_presentation_root">
            <h2>Button</h2>
            <p>lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>
            <div className="CL_UI_component_preview_root">
              <Routes>
                <Route path="/" element={<Button />} exact />
                <Route path="/input" element={<Input />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
