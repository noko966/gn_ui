/** @type { import('@storybook/react-vite').Preview } */
import "../src/assets/styles/flags.css";
import "../src/assets/styles/fonts.css";
import "../src/assets/styles/global.css";
import "../src/assets/styles/variables.css";

const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
