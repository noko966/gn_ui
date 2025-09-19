// vite.builder.config.js
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
export default defineConfig({
    plugins: [
        react({}),
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(resolve(__dirname, "src/assets/fonts")),
                    dest: "assets",
                },
                {
                    src: normalizePath(resolve(__dirname, "src/assets/images")),
                    dest: "assets",
                },
                {
                    src: normalizePath(resolve(__dirname, "src/assets/styles")),
                    dest: "assets",
                },
            ],
        }),
    ],

    server: {
        port: 3100,
    },
    build: {
        copyPublicDir: false,
        emptyOutDir: true,
    },
});
