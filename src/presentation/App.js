
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github-dark-dimmed.css';
import Button from "./components/Button";
import Input from "./components/Input";
import Tab from "./components/Tab";

import './styles/ui.css'
import '../lib/styles/global.css'
import '../lib/styles/variables.css'
hljs.registerLanguage('javascript', javascript);

const App = () => {

  useEffect(() => {
    // Highlight all code blocks
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  }, []); // Empty dependency array means this effect runs once on mount
  return (
    <Router>
      <div className="CL_UI_root">
        <aside className="CL_UI_aside_root">
          <div className="CL_UI_root_logo">
          </div>
          <h3>Components</h3>
          <div className="CL_UI_aside_links">
            <Link to="/">Docs</Link>
            <Link to="/button">Button</Link>
            <Link to="/input">Input</Link>
            <Link to="/tab">Tab</Link>
          </div>
        </aside>
        <main className="CL_UI_main_root">
          <div className="CL_UI_presentation_root">
            <div className='CL_UI_component_preview_root'>
              <Routes>
                <Route path="/button" element={<div className='CL_UI_component_preview_row'>
                  <Button />
                  <Button />
                  <Button />
                  <Button />
                  <Button />
                  <Button />
                </div>} />
                <Route path="/input" element={<Input />} />
                <Route path="/Tab" element={<Tab />} />
              </Routes>

              

            </div>

            <pre>
                <code>
                  {`
import React from "react";

const Input = ({ placeholder }) => {
  return (
    <div className="dg_input_root">
      <input className="dg_input" type="text" placeholder={placeholder} />
    </div>
  );
};

export default Input;
`}
                </code>
              </pre>

          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
