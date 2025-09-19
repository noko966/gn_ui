import { Flag } from "../lib/index.js";

export default {
    title: "Digitain/Flag",
    component: Flag,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        countryCode: { control: "text" },
        size: { control: "select", options: ["small", "medium", "large"] },
        className: { control: "text" },
    },
    args: {
        countryCode: "US",
        size: "medium",
    },
};

export const Default = {
    args: {
        countryCode: "US",
    },
};

export const UnitedKingdom = {
    args: {
        countryCode: "GB",
    },
};

export const Germany = {
    args: {
        countryCode: "DE",
    },
};

export const France = {
    args: {
        countryCode: "FR",
    },
};

export const Spain = {
    args: {
        countryCode: "ES",
    },
};

export const Italy = {
    args: {
        countryCode: "IT",
    },
};

export const Russia = {
    args: {
        countryCode: "RU",
    },
};

export const Brazil = {
    args: {
        countryCode: "BR",
    },
};

export const FlagCollection = {
    render: () => (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["US", "GB", "DE", "FR", "ES", "IT", "RU", "BR", "CA", "AU"].map((code) => (
                <div key={code} style={{ textAlign: "center" }}>
                    <Flag countryCode={code} />
                    <div style={{ fontSize: "12px", marginTop: "5px" }}>{code}</div>
                </div>
            ))}
        </div>
    ),
};
