import { MarketComponent, marketComponentFakeData } from "../lib/index.js";

export default {
    title: "Digitain/Sports/EventMarkets",
    component: MarketComponent,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        view: {
            control: "select",
            options: ["european"],
        },
        variant: {
            control: "select",
            options: ["standard", "compact", "expanded"],
        },
    },
    args: {
        view: "european",
        variant: "standard",
    },
};

export const European = {
    args: {
        view: "european",
        variant: "standard",
        data: marketComponentFakeData,
    },
};

export const CompactMarkets = {
    args: {
        view: "european",
        variant: "compact",
        data: marketComponentFakeData,
    },
};

export const ExpandedMarkets = {
    args: {
        view: "european",
        variant: "expanded",
        data: marketComponentFakeData,
    },
};

export const WithSampleData = {
    args: {
        view: "european",
        variant: "standard",
        data: [
            {
                Id: 1,
                N: "Match Result",
                IsC: true,
                Stakes: [
                    {
                        Id: 1,
                        N: "Home Win",
                        F: 2.1,
                        IsA: true,
                        IsC: true,
                    },
                    {
                        Id: 2,
                        N: "Draw",
                        F: 3.2,
                        IsA: true,
                        IsC: true,
                    },
                    {
                        Id: 3,
                        N: "Away Win",
                        F: 2.8,
                        IsA: true,
                        IsC: true,
                    },
                ],
            },
            {
                Id: 2,
                N: "Total Goals",
                IsC: true,
                Stakes: [
                    {
                        Id: 4,
                        N: "Over 2.5",
                        F: 1.85,
                        IsA: true,
                        IsC: true,
                    },
                    {
                        Id: 5,
                        N: "Under 2.5",
                        F: 1.95,
                        IsA: true,
                        IsC: true,
                    },
                ],
            },
        ],
    },
};
