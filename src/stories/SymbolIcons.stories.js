// SidebarEuropeanFull.stories.jsx
import React from "react";
import { Symbol } from "../../library/digi-library.js";

export default {
  title: "Digitain/SymbolIcons",
  component: Symbol, // Assuming Scroll is your main component for the story
  argTypes: {
    // view: { control: "select", options: ["european", "esport"] },
    // Add more controls for other props if necessary
  },
};

const Template = (args) => {
  // Generate an array of Symbol components with sportId from 1 to 150
  const symbols = Array.from({ length: 150 }, (_, index) => (
    <Symbol key={index + 1} sportId={index + 1} {...args} />
  ));

  return (
    <div
      style={{
        width: "300px",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        rowGap: "6px",
        columnGap: "6px",
      }}
    >
      {symbols}
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  // view: "european",
};
