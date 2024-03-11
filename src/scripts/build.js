const fs = require('fs');
const path = require('path');
const hljs = require('highlight.js');

const componentsSrcDir = path.join(__dirname, '../lib/components');
const appJsPath = path.join(__dirname, '../presentation/App.js');

// Utility function to escape source code for template literals
const escapeSourceCode = (sourceCode) => sourceCode.replace(/`/g, '\\`').replace(/\$/g, '\\$');

// Reads component source, escapes it, and prepares template literals
const prepareComponentSource = (componentPath) => {
    console.log('asdddddddddddddddddddddddd', componentPath);
     const filePath = path.join(componentPath, 'index.js');
  const sourceCode = fs.readFileSync(filePath, 'utf-8');
  return escapeSourceCode(sourceCode);
};

const generateAppJs = () => {
  const componentFiles = fs.readdirSync(componentsSrcDir);
  const imports = [];
  const routes = [];
  const sourceCodes = [];

  componentFiles.forEach((filename) => {
      const componentName = path.basename(filename, '.js');
    const importPath = `./components/${filename}`;
    const routePath = `/${componentName.toLowerCase()}`;

    imports.push(`import ${componentName} from "${importPath}";`);

    const componentSourcePath = path.join(componentsSrcDir, filename);
    const escapedSourceCode = prepareComponentSource(componentSourcePath);

    // Save the source code as a string
    sourceCodes.push(`const ${componentName}Source = \`${escapedSourceCode}\`;`);

    // Prepare routes and component display logic
    routes.push(`
      <Route path="${routePath}" element={
        <div>
          <h2>${componentName}</h2>
          <${componentName} />
          <pre><code className="javascript">${componentName}Source</code></pre>
        </div>
      } />
    `);
  });

  const appJsContent = `
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'highlight.js/styles/github.css';
${imports.join('\n')}
${sourceCodes.join('\n')}

const App = () => (
  <Router>
    <nav>
      <Link to="/">Home</Link>
      {/* Add other navigation links here */}
    </nav>
    <Routes>
      ${routes.join('')}
    </Routes>
  </Router>
);

export default App;
  `;

  fs.writeFileSync(appJsPath, appJsContent);
  console.log('App.js has been generated!');
};

generateAppJs();
