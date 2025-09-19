import React from "react";
import { fn } from "storybook/test";
import { Button, Collapse } from "../lib/index.js";

export default {
    title: "Digitain/Interactive/Collapse",
    component: Collapse,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        isExpanded: { control: "boolean" },
        title: { control: "text" },
        variant: {
            control: "select",
            options: ["default", "bordered", "minimal"],
        },
        animationDuration: { control: "number" },
        className: { control: "text" },
    },
    args: {
        onToggle: fn(),
        isExpanded: false,
        title: "Collapse Title",
        variant: "default",
        animationDuration: 300,
    },
};

export const Default = {
    render: (args) => (
        <div style={{ width: "400px" }}>
            <Collapse {...args}>
                <div style={{ padding: "20px", background: "#f5f5f5" }}>
                    <h3>Collapsed Content</h3>
                    <p>This content can be shown or hidden by clicking the collapse header.</p>
                    <Button text="Sample Action" onClick={fn()} />
                </div>
            </Collapse>
        </div>
    ),
    args: {
        title: "Default Collapse",
        isExpanded: false,
    },
};

export const Expanded = {
    render: (args) => (
        <div style={{ width: "400px" }}>
            <Collapse {...args}>
                <div style={{ padding: "20px", background: "#f5f5f5" }}>
                    <h3>Expanded Content</h3>
                    <p>This collapse component starts in an expanded state.</p>
                    <Button text="Sample Action" onClick={fn()} />
                </div>
            </Collapse>
        </div>
    ),
    args: {
        title: "Expanded Collapse",
        isExpanded: true,
    },
};

export const Bordered = {
    render: (args) => (
        <div style={{ width: "400px" }}>
            <Collapse {...args}>
                <div style={{ padding: "20px", background: "#f9f9f9" }}>
                    <h3>Bordered Collapse</h3>
                    <p>This collapse has a bordered variant style.</p>
                    <ul>
                        <li>Item 1</li>
                        <li>Item 2</li>
                        <li>Item 3</li>
                    </ul>
                </div>
            </Collapse>
        </div>
    ),
    args: {
        title: "Bordered Collapse",
        variant: "bordered",
        isExpanded: false,
    },
};

export const Minimal = {
    render: (args) => (
        <div style={{ width: "400px" }}>
            <Collapse {...args}>
                <div style={{ padding: "15px" }}>
                    <h4>Minimal Style</h4>
                    <p>This collapse uses a minimal design variant.</p>
                </div>
            </Collapse>
        </div>
    ),
    args: {
        title: "Minimal Collapse",
        variant: "minimal",
        isExpanded: false,
    },
};

export const WithLongContent = {
    render: (args) => (
        <div style={{ width: "500px" }}>
            <Collapse {...args}>
                <div style={{ padding: "20px", background: "#fafafa" }}>
                    <h3>Long Content Example</h3>
                    <p>
                        This example demonstrates how the collapse component handles longer content that might overflow
                        or require scrolling.
                    </p>
                    {Array.from({ length: 10 }, (_, i) => (
                        <div
                            key={i}
                            style={{ padding: "10px", margin: "5px 0", background: "white", borderRadius: "4px" }}>
                            Content item {i + 1} - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </div>
                    ))}
                </div>
            </Collapse>
        </div>
    ),
    args: {
        title: "Collapse with Long Content",
        isExpanded: false,
    },
};

export const Interactive = {
    render: () => {
        const [isExpanded, setIsExpanded] = React.useState(false);

        return (
            <div style={{ width: "400px" }}>
                <Collapse
                    title="Interactive Collapse"
                    isExpanded={isExpanded}
                    onToggle={() => setIsExpanded(!isExpanded)}>
                    <div style={{ padding: "20px", background: "#e8f4fd" }}>
                        <h3>Interactive Content</h3>
                        <p>Click the header to toggle this content.</p>
                        <p>Current state: {isExpanded ? "Expanded" : "Collapsed"}</p>
                        <Button text="Toggle" onClick={() => setIsExpanded(!isExpanded)} />
                    </div>
                </Collapse>
            </div>
        );
    },
};
