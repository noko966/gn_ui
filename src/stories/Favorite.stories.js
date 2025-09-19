import React from "react";
import { fn } from "storybook/test";
import { Favorite } from "../lib/index.js";

export default {
    title: "Digitain/Interactive/Favorite",
    component: Favorite,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        isFavorite: { control: "boolean" },
        isDisabled: { control: "boolean" },
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
        className: { control: "text" },
    },
    args: {
        onClick: fn(),
        isFavorite: false,
        isDisabled: false,
        size: "medium",
    },
};

export const Default = {
    args: {
        isFavorite: false,
        isDisabled: false,
    },
};

export const Favorited = {
    args: {
        isFavorite: true,
        isDisabled: false,
    },
};

export const Disabled = {
    args: {
        isFavorite: false,
        isDisabled: true,
    },
};

export const DisabledFavorited = {
    args: {
        isFavorite: true,
        isDisabled: true,
    },
};

export const SmallSize = {
    args: {
        isFavorite: false,
        size: "small",
    },
};

export const LargeSize = {
    args: {
        isFavorite: true,
        size: "large",
    },
};

export const Interactive = {
    render: () => {
        const [isFavorite, setIsFavorite] = React.useState(false);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
                <div>
                    <h3>Click to toggle favorite status:</h3>
                    <Favorite isFavorite={isFavorite} onClick={() => setIsFavorite(!isFavorite)} />
                </div>
                <div style={{ textAlign: "center" }}>Status: {isFavorite ? "Favorited" : "Not favorited"}</div>
            </div>
        );
    },
};
