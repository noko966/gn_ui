/** @type { import('@storybook/react-vite').StorybookConfig } */
export default {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-webpack5-compiler-swc",
        "@storybook/addon-onboarding",
        "@storybook/addon-links",
        "@chromatic-com/storybook",
        "@storybook/addon-themes",
        "@storybook/addon-docs"
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {},
    },
    docs: {
        brandImageL: "https://sport.totogaming.am/Img/partners/2/tg_logo.png"
    },
};
