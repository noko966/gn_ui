import { Text } from "../lib/index.js";

export default {
    title: "Digitain/Text",
    component: Text,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["body", "caption", "heading", "subheading"],
        },
        color: { control: "color" },
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
        weight: {
            control: "select",
            options: ["normal", "bold", "light"],
        },
        className: { control: "text" },
        children: { control: "text" },
    },
    args: {
        children: "Sample text",
        variant: "body",
        size: "medium",
        weight: "normal",
    },
};

export const Default = {
    args: {
        children: "This is default text",
    },
};

export const Heading = {
    args: {
        children: "This is a heading",
        variant: "heading",
        weight: "bold",
    },
};

export const Subheading = {
    args: {
        children: "This is a subheading",
        variant: "subheading",
        weight: "bold",
    },
};

export const Body = {
    args: {
        children: "This is body text with normal weight",
        variant: "body",
    },
};

export const Caption = {
    args: {
        children: "This is caption text",
        variant: "caption",
        size: "small",
    },
};

export const BoldText = {
    args: {
        children: "This is bold text",
        weight: "bold",
    },
};

export const LightText = {
    args: {
        children: "This is light text",
        weight: "light",
    },
};

export const TextSizes = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Text size="small">Small text</Text>
            <Text size="medium">Medium text</Text>
            <Text size="large">Large text</Text>
        </div>
    ),
};
