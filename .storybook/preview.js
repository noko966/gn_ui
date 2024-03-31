/** @type { import('@storybook/react').Preview } */
import '../library/global.css'
import '../library/fonts.css'
import '../library/variables.css'

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
