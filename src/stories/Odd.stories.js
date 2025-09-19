import { fn } from "storybook/test";
import { Odd } from "../lib/index.js";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
    title: "Digitain/Odd",
    component: Odd,
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
        factor: "1.2",
        isActive: false,
        isDisabled: false,
        view: "european",
    },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const European = {
    args: {
        factor: "1.2",
        isActive: false,
        isDisabled: false,
        view: "european",
    },
};
export const African = {
    args: {
        factor: "1.2",
        isActive: false,
        isDisabled: false,
        view: "african",
    },
};
export const Asian = {
    args: {
        factor: "1.2",
        isActive: false,
        isDisabled: false,
        view: "asian",
    },
};

export const Esport = {
    args: {
        factor: "1.447",
        isActive: false,
        isDisabled: false,
        view: "esport",
    },
};
export const EsportResultP1 = {
    args: {
        factor: "1.447",
        isActive: false,
        isDisabled: false,
        view: "esport",
        variant: "result_p1",
    },
};
export const EsportResultP2 = {
    args: {
        factor: "1.447",
        isActive: false,
        isDisabled: false,
        view: "esport",
        variant: "result_p2",
    },
};
export const EsportResultX = {
    args: {
        factor: "1.01",
        isActive: false,
        isDisabled: false,
        view: "esport",
        variant: "result_x",
    },
};
