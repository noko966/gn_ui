import { Tooltip, TooltipRoot } from "../lib/index.js";

export default {
    title: "Digitain/Tooltip",
    component: Tooltip,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        content: { control: "text" },
        position: {
            control: "select",
            options: ["top", "bottom", "left", "right"],
        },
        trigger: {
            control: "select",
            options: ["hover", "click", "focus"],
        },
        isVisible: { control: "boolean" },
        className: { control: "text" },
    },
    args: {
        content: "This is a tooltip",
        position: "top",
        trigger: "hover",
        isVisible: false,
    },
};

export const Default = {
    render: (args) => (
        <div style={{ padding: "50px" }}>
            <TooltipRoot>
                <button>Hover me</button>
                <Tooltip {...args} />
            </TooltipRoot>
        </div>
    ),
    args: {
        content: "Default tooltip content",
        position: "top",
    },
};

export const TopTooltip = {
    render: (args) => (
        <div style={{ padding: "50px" }}>
            <TooltipRoot>
                <button>Hover for top tooltip</button>
                <Tooltip {...args} />
            </TooltipRoot>
        </div>
    ),
    args: {
        content: "Tooltip on top",
        position: "top",
    },
};

export const BottomTooltip = {
    render: (args) => (
        <div style={{ padding: "50px" }}>
            <TooltipRoot>
                <button>Hover for bottom tooltip</button>
                <Tooltip {...args} />
            </TooltipRoot>
        </div>
    ),
    args: {
        content: "Tooltip on bottom",
        position: "bottom",
    },
};

export const LeftTooltip = {
    render: (args) => (
        <div style={{ padding: "50px" }}>
            <TooltipRoot>
                <button>Hover for left tooltip</button>
                <Tooltip {...args} />
            </TooltipRoot>
        </div>
    ),
    args: {
        content: "Tooltip on left",
        position: "left",
    },
};

export const RightTooltip = {
    render: (args) => (
        <div style={{ padding: "50px" }}>
            <TooltipRoot>
                <button>Hover for right tooltip</button>
                <Tooltip {...args} />
            </TooltipRoot>
        </div>
    ),
    args: {
        content: "Tooltip on right",
        position: "right",
    },
};

export const LongContent = {
    render: (args) => (
        <div style={{ padding: "50px" }}>
            <TooltipRoot>
                <button>Hover for long tooltip</button>
                <Tooltip {...args} />
            </TooltipRoot>
        </div>
    ),
    args: {
        content:
            "This is a very long tooltip content that should wrap appropriately and demonstrate how the tooltip handles longer text content.",
        position: "top",
    },
};
