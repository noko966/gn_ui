import { fn } from "@storybook/test";
import { Input } from "../../library/digi-library.js"


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Digitain/Input",
  component: Input,
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
    sportIconStyle: 400,
    isSearcgInput: false,
    isDatePickerInput: false,
    isDisabled: false

  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    placeholder: "type here",
    sportIconStyle: 400,
    isSearcgInput: false,
    isDatePickerInput: false,
    isDisabled: false
  },
};

export const Search = {
  args: {
    placeholder: "type to search",
    sportIconStyle: 400,
    isSearcgInput: true,
    isDatePickerInput: false,
    isDisabled: false

  },
};

export const Date = {
  args: {
    placeholder: "10/03/2022",
    sportIconStyle: 400,
    isSearcgInput: false,
    isDatePickerInput: true,
    isDisabled: false
  },
};

export const Disabled = {
  args: {
    placeholder: "input disabled",
    sportIconStyle: 400,
    isSearcgInput: false,
    isDatePickerInput: false,
    isDisabled: true
  },
};

