// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "src", "digi_builder_start.js"),
  output: {
    path: path.resolve(__dirname, "demo"),
    filename: "digi_builder_start.js",
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "public", "index.html"),
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, "src", "lib", "styles"),
          to: path.resolve(__dirname, "demo"),
        },
        {
          from: path.join(__dirname, "src", "lib", "fonts"),
          to: path.resolve(__dirname, "demo", "fonts"),
        },
        {
          from: path.join(__dirname, "src", "lib", "images"),
          to: path.resolve(__dirname, "demo", "images"),
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader", // Creates `style` nodes from JS strings
          "css-loader", // Translates CSS into CommonJS
          "sass-loader", // Compiles Sass to CSS
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
  // externals: {
  //   react: "react",
  //   "react-dom": "react-dom",
  // },
  // resolve: {
  //   extensions: [
  //     path.resolve(__dirname, "src", "node_modules"),
  //     path.resolve(__dirname, "node_modules"),
  //   ],
  // },

  devServer: {
    static: {
      directory: path.join(__dirname, "src", "public/"),
    },
    port: 8080,
    compress: true,
    // port: 8080,
    open: true,
    hot: true,
  },
};
