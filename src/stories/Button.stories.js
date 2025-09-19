import { fn } from "storybook/test";
import { Button, European_Button_var_settings, European_Buttons_Row_settings, Symbol } from "../lib/index.js";

export default {
    title: "Digitain/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["normal", "accent", "outline"],
        },
        isDisabled: { control: "boolean" },
        text: { control: "text" },
        className: { control: "text" },
    },
    args: {
        onClick: fn(),
        text: "Click me",
        isDisabled: false,
        variant: "normal",
    },
};

// Standard Button stories
export const Normal = {
    args: {
        text: "Normal Button",
        variant: "normal",
        isDisabled: false,
    },
};

export const Accent = {
    args: {
        text: "Accent Button",
        variant: "accent",
        isDisabled: false,
    },
};

export const Outline = {
    args: {
        text: "Outline Button",
        variant: "outline",
        isDisabled: false,
    },
};

export const Disabled = {
    args: {
        text: "Disabled Button",
        variant: "normal",
        isDisabled: true,
    },
};

export const WithIcon = {
    args: {
        text: "Button with Icon",
        variant: "normal",
        icon: <Symbol sportId="1" />,
        isDisabled: false,
    },
};

// European Settings Button
export const EuropeanSettings = {
    render: (args) => <European_Button_var_settings onClick={args.onClick} icon={<Symbol sportId="settings" />} />,
    args: {
        onClick: fn(),
    },
};

// Button Row
export const ButtonRow = {
    render: (args) => (
        <European_Buttons_Row_settings>
            <Button text="Button 1" variant="normal" onClick={fn()} />
            <Button text="Button 2" variant="accent" onClick={fn()} />
            <Button text="Button 3" variant="outline" onClick={fn()} />
        </European_Buttons_Row_settings>
    ),
};
