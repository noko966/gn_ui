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
    backgroundColor: { control: "color" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onClick: fn(),
    child: "Text",
    isActive: false,
    isDisabled: false,
    view: "european",
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const European = {
  args: {
    child: "Text",
    isActive: true,
    isDisabled: false,
    view: "european",
  },
};
export const EuropeanActive = {
  args: {
    child: "Text Active",
    isActive: true,
    isDisabled: false,
    view: "european",
  },
};
export const EuropeanDisabled = {
  args: {
    child: "Text Disabled",
    isActive: false,
    isDisabled: true,
    view: "european",
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
