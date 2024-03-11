import React from 'react';

const UIPresentationTemplate = ({ Component, name, description, exampleCode }) => {
  return (
    <div className="CL_UI_presentation_root">
      <h2>{name}</h2>
      <p>{description}</p>
      <div className="CL_UI_component_preview_root">
        <Component />
      </div>
      {/* Assume `exampleCode` is a string containing the component usage example */}
      <pre>{exampleCode}</pre>
    </div>
  );
};

export default UIPresentationTemplate;