import React from "react";

import { fn } from "@storybook/test";
import { SideItem } from "../../library/digi-library.js";
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Digitain/SideItem",
  component: SideItem,

  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    view: { control: "select", options: ["european", "esport"] },
    sportId: {
      control: "select",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    },
    iconVariant: { control: "select", options: [400, 300] },
  },

  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onClick: fn(),
    child: "Text",
    iconVariant: 400,
    sportId: 1,
    isActive: false,
    isDisabled: false,
    view: "european",
    isVariantCountry: false,
    fId: null,
  },
};

export const SidebarEuropeanFull = {
  render: (args) => (
    <div style={{ width: "190px" }} {...args}>
      <SideItem child="item one" view="european" sportId={2} />
      <SideItem child="item two" view="european" sportId={3} />
      <SideItem child="item three" view="european" sportId={10} />
      <SideItem child="item three" view="european" sportId={10} />
      <SideItem
        child="country one"
        view="european"
        fId={166}
        isVariantCountry={true}
      />
      <SideItem
        child="country one"
        view="european"
        fId={166}
        isVariantCountry={true}
      />
      <SideItem
        child="country one"
        view="european"
        fId={166}
        isVariantCountry={true}
      />
      <SideItem
        child="country one"
        view="european"
        fId={166}
        isVariantCountry={true}
      />
      <SideItem child="item one" view="european" sportId={11} />
    </div>
  ),
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const European = {
  args: {
    child: "Text",
    sportId: 1,
    isActive: true,
    isDisabled: false,
    view: "european",
  },
};
export const EuropeanActive = {
  args: {
    child: "Text Active",
    sportId: 2,
    isActive: true,
    isDisabled: false,
    view: "european",
  },
};
export const EuropeanDisabled = {
  args: {
    child: "Text Disabled",
    sportId: 2,
    isActive: false,
    isDisabled: true,
    view: "european",
  },
};

export const EuropeanCountry = {
  args: {
    child: "Coubtry name",
    isActive: true,
    isDisabled: false,
    view: "european",
    isVariantCountry: true,
    fId: 113,
  },
};

export const Esport = {
  args: {
    child: "Text",
    isActive: true,
    isDisabled: false,
    view: "esport",
  },
};
export const EsportActive = {
  args: {
    child: "Text Active",
    isActive: true,
    isDisabled: false,
    view: "esport",
  },
};
export const EsportDisabled = {
  args: {
    child: "Text Disabled",
    isActive: false,
    isDisabled: true,
    view: "esport",
  },
};
