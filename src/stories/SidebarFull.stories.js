// SidebarEuropeanFull.stories.jsx
import React from "react";
import { SideItem, Scroll } from "../../library/digi-library.js";

export default {
  title: "Digitain/SidebarEuropeanFull",
  component: Scroll, // Assuming Scroll is your main component for the story
  argTypes: {
    view: { control: "select", options: ["european", "esport"] },
    // Add more controls for other props if necessary
  },
};

const Template = ({ view, ...args }) => {
  return (
    <div style={{ width: "200px", height: "250px" }}>
      <Scroll view={view} fullHeight={true} {...args}>
        <SideItem view={view} child="item one" sportId={2} />
        <SideItem view={view} child="item two" sportId={3} />
        <SideItem view={view} child="item three" sportId={10} />
        <SideItem view={view} child="item three" sportId={10} />
        <SideItem
          view={view}
          child="country one"
          fId={166}
          isVariantCountry={true}
        />
        <SideItem
          view={view}
          child="country one"
          fId={166}
          isVariantCountry={true}
        />
        <SideItem
          view={view}
          child="country one"
          fId={166}
          isVariantCountry={true}
        />
        <SideItem
          view={view}
          child="country one"
          fId={166}
          isVariantCountry={true}
        />
        <SideItem view={view} child="item one" sportId={11} />
      </Scroll>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  view: "european",
};
