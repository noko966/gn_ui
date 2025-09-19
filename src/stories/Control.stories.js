import { fn } from "storybook/test";
import { Control } from "../lib/index.js";

export default {
    title: "Digitain/Interactive/Control",
    component: Control,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        type: {
            control: "select",
            options: ["button", "checkbox", "radio", "toggle"],
        },
        variant: {
            control: "select",
            options: ["primary", "secondary", "outline"],
        },
        isActive: { control: "boolean" },
        isDisabled: { control: "boolean" },
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
        label: { control: "text" },
        className: { control: "text" },
    },
    args: {
        onClick: fn(),
        type: "button",
        variant: "primary",
        isActive: false,
        isDisabled: false,
        size: "medium",
        label: "Control",
    },
};

export const Button = {
    args: {
        type: "button",
        label: "Button Control",
        variant: "primary",
    },
};

export const Checkbox = {
    args: {
        type: "checkbox",
        label: "Checkbox Control",
        isActive: false,
    },
};

export const CheckboxChecked = {
    args: {
        type: "checkbox",
        label: "Checked Checkbox",
        isActive: true,
    },
};

export const Radio = {
    args: {
        type: "radio",
        label: "Radio Control",
        isActive: false,
    },
};

export const RadioSelected = {
    args: {
        type: "radio",
        label: "Selected Radio",
        isActive: true,
    },
};

export const Toggle = {
    args: {
        type: "toggle",
        label: "Toggle Control",
        isActive: false,
    },
};

export const ToggleActive = {
    args: {
        type: "toggle",
        label: "Active Toggle",
        isActive: true,
    },
};

export const Disabled = {
    args: {
        type: "button",
        label: "Disabled Control",
        isDisabled: true,
    },
};

export const ControlSizes = {
    render: () => (
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <Control type="button" label="Small" size="small" onClick={fn()} />
            <Control type="button" label="Medium" size="medium" onClick={fn()} />
            <Control type="button" label="Large" size="large" onClick={fn()} />
        </div>
    ),
};

export const ControlVariants = {
    render: () => (
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <Control type="button" label="Primary" variant="primary" onClick={fn()} />
            <Control type="button" label="Secondary" variant="secondary" onClick={fn()} />
            <Control type="button" label="Outline" variant="outline" onClick={fn()} />
        </div>
    ),
};
