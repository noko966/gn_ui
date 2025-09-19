import { fn } from "storybook/test";
import { Input, Radio, Search_European, Symbol } from "../lib/index.js";

export default {
    title: "Digitain/Input",
    component: Input,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["normal"],
        },
        isDisabled: { control: "boolean" },
        placeholder: { control: "text" },
        label: { control: "text" },
        className: { control: "text" },
    },
    args: {
        onChange: fn(),
        placeholder: "Enter text...",
        isDisabled: false,
        variant: "normal",
    },
};

// Standard Input stories
export const Default = {
    args: {
        placeholder: "Enter text...",
        isDisabled: false,
    },
};

export const WithLabel = {
    args: {
        placeholder: "Enter your name",
        label: "Name",
        isDisabled: false,
    },
};

export const Disabled = {
    args: {
        placeholder: "Disabled input",
        isDisabled: true,
    },
};

export const WithIcon = {
    args: {
        placeholder: "Search...",
        icon: <Symbol sportId="search" />,
        isDisabled: false,
    },
};

// Search European Input
export const SearchEuropean = {
    render: (args) => (
        <Search_European onChange={args.onChange} placeholder={args.placeholder} isDisabled={args.isDisabled} />
    ),
    args: {
        onChange: fn(),
        placeholder: "Search European...",
        isDisabled: false,
    },
};

// Radio Input
export const RadioButton = {
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Radio onChange={args.onChange} label="Option 1" name="radio-group" isDisabled={false} />
            <Radio onChange={args.onChange} label="Option 2" name="radio-group" isDisabled={false} />
            <Radio onChange={args.onChange} label="Disabled Option" name="radio-group" isDisabled={true} />
        </div>
    ),
    args: {
        onChange: fn(),
    },
};
