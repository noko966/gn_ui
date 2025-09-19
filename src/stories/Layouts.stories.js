import { fn } from "storybook/test";
import { Button, Root, Scroll } from "../lib/index.js";

export default {
    title: "Digitain/Layouts",
    component: Root,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    argTypes: {
        view: {
            control: "select",
            options: ["european", "esport"],
        },
        className: { control: "text" },
    },
    args: {
        view: "european",
    },
};

export const RootLayout = {
    render: (args) => (
        <Root {...args}>
            <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "300px" }}>
                <h2>Root Layout Content</h2>
                <p>This is content inside the Root layout component.</p>
                <Button text="Sample Button" onClick={fn()} />
            </div>
        </Root>
    ),
    args: {
        view: "european",
    },
};

export const RootEuropean = {
    render: (args) => (
        <Root {...args}>
            <div style={{ padding: "20px", background: "#e8f4fd", minHeight: "300px" }}>
                <h2>European Layout</h2>
                <p>This shows the European view variant of the Root layout.</p>
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <Button text="Action 1" variant="normal" onClick={fn()} />
                    <Button text="Action 2" variant="accent" onClick={fn()} />
                </div>
            </div>
        </Root>
    ),
    args: {
        view: "european",
    },
};

export const RootEsport = {
    render: (args) => (
        <Root {...args}>
            <div style={{ padding: "20px", background: "#f0f8ff", minHeight: "300px" }}>
                <h2>Esport Layout</h2>
                <p>This shows the Esport view variant of the Root layout.</p>
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <Button text="Game 1" variant="outline" onClick={fn()} />
                    <Button text="Game 2" variant="outline" onClick={fn()} />
                </div>
            </div>
        </Root>
    ),
    args: {
        view: "esport",
    },
};

export const ScrollLayout = {
    render: (args) => (
        <div style={{ height: "400px", border: "1px solid #ccc" }}>
            <Scroll {...args}>
                <div style={{ padding: "20px" }}>
                    <h2>Scrollable Content</h2>
                    {Array.from({ length: 20 }, (_, i) => (
                        <div key={i} style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                            <h3>Item {i + 1}</h3>
                            <p>This is scrollable content item {i + 1}. You can scroll through all these items.</p>
                        </div>
                    ))}
                </div>
            </Scroll>
        </div>
    ),
    args: {
        view: "european",
    },
};

export const ScrollEuropean = {
    render: (args) => (
        <div style={{ height: "300px", border: "1px solid #ccc" }}>
            <Scroll {...args}>
                <div style={{ padding: "20px", background: "#fafafa" }}>
                    <h2>European Scroll</h2>
                    {Array.from({ length: 15 }, (_, i) => (
                        <div
                            key={i}
                            style={{ padding: "8px", margin: "5px 0", background: "white", borderRadius: "4px" }}>
                            European Item {i + 1}
                        </div>
                    ))}
                </div>
            </Scroll>
        </div>
    ),
    args: {
        view: "european",
    },
};

export const ScrollEsport = {
    render: (args) => (
        <div style={{ height: "300px", border: "1px solid #ccc" }}>
            <Scroll {...args}>
                <div style={{ padding: "20px", background: "#f8f8f8" }}>
                    <h2>Esport Scroll</h2>
                    {Array.from({ length: 15 }, (_, i) => (
                        <div
                            key={i}
                            style={{ padding: "8px", margin: "5px 0", background: "white", borderRadius: "4px" }}>
                            Esport Item {i + 1}
                        </div>
                    ))}
                </div>
            </Scroll>
        </div>
    ),
    args: {
        view: "esport",
    },
};
