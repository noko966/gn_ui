import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
  theme: create({
    base: "dark",
    brandTitle: "Digitain Component Library",
    brandUrl: "https://www.digitain.com/",
    // brandImage:
    //   "https://www.digitain.com/wp-content/themes/digitain_wp_theme/assets/img/digitain_logo.png",
    brandTarget: "_self",
  }),
});
