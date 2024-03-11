
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'highlight.js/styles/github.css';
import Button from "./components/Button";
import Input from "./components/Input";
import Tab from "./components/Tab";
const ButtonSource = `import React from "react";

const Button = ({ title = 'click me' }) => {
  return <button className="dg_button_root">{title}</button>;
};

export default Button;
`;
const InputSource = `import React from "react";

const Input = ({ placeholder }) => {
  return (
    <div className="dg_input_root">
      <input className="dg_input" type="text" placeholder={placeholder} />
    </div>
  );
};

export default Input;
`;
const TabSource = `import React from "react";

const Tab = ({ title = 'title' }) => {
  return <button className="dg_button_root">{title}</button>;
};

export default Tab;
`;

const App = () => (
  <Router>
    <nav>
      <Link to="/">Home</Link>
      {/* Add other navigation links here */}
    </nav>
    <Routes>
      
      <Route path="/button" element={
        <div>
          <h2>Button</h2>
          <Button />
          <pre><code className="javascript">ButtonSource</code></pre>
        </div>
      } />
    
      <Route path="/input" element={
        <div>
          <h2>Input</h2>
          <Input />
          <pre><code className="javascript">InputSource</code></pre>
        </div>
      } />
    
      <Route path="/tab" element={
        <div>
          <h2>Tab</h2>
          <Tab />
          <pre><code className="javascript">TabSource</code></pre>
        </div>
      } />
    
    </Routes>
  </Router>
);

export default App;
  