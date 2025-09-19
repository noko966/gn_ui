import { fn } from "storybook/test";
import { Dropdown } from "../lib/index.js";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
    title: "Digitain/Dropdown",
    component: Dropdown,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        // backgroundColor: { control: "color" },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: {
        onClick: fn(),
        options: [
            { value: "football", icon: "sport_front_icon-1" },
            { value: "basketball", icon: "sport_front_icon-2" },
            { value: "ruckby", icon: "sport_front_icon-5" },
        ],
        sportIconStyle: 400,
        isWithIcon: false,
        isDisabled: false,
        iconPositionStart: false,
    },
};

// Define the template for rendering the dropdown
const Template = ({ ...args }) => (
    <div style={{ width: "300px", margin: "auto" }}>
        <Dropdown {...args} />
    </div>
);

// Use the Template in the story
export const Default = {
    render: Template,
    args: {
        options: [
            { value: "football", icon: "sport_front_icon-1" },
            { value: "basketball", icon: "sport_front_icon-2" },
            { value: "ruckby", icon: "sport_front_icon-5" },
        ],
        sportIconStyle: 400,
        isWithIcon: false,
        iconClassName: "sport_front_icon-1",
        isDisabled: false,
        iconPositionStart: false,
    },
};
