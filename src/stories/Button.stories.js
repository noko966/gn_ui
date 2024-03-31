import { fn } from "@storybook/test";
import { Button, Input, Event } from "../../library/digi-library.js";


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Digitain/Button",
  component: Button,
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
    isPrimary: false,
    sportIconStyle: 400,
    isWithIcon: false,
    iconClassName: "dg_icon_lock",
    isDisabled: false,
    title: "simple button",
    iconPositionStart: false,
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    isPrimary: true,
    sportIconStyle: 400,
    isWithIcon: false,
    iconClassName: "",
    isDisabled: false,
    title: "primary button",
  },
};

export const Secondary = {
  args: {
    isPrimary: false,
    sportIconStyle: 400,
    isWithIcon: false,
    iconClassName: "",
    isDisabled: false,
    title: "secondary button",
  },
};

export const PrimaryWithSportIcon = {
  args: {
    isPrimary: true,
    sportIconStyle: 400,
    isWithIcon: true,
    iconClassName: "sport_front_icon-1",
    isDisabled: false,
    title: "primary button",
  },
};
