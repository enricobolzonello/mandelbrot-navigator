const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { experiments } = require('webpack');

module.exports = {
  entry: './js/main.ts',
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      root: path.resolve(__dirname, "."),
    }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          compilerOptions: {
            module: "esnext"
          }
        }
      },
      {
        test: /\.(css|scss)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "css/" },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        use: [{ loader: "file-loader?name=./static/[name].[ext]" }],
      },
      {
        test: /\.(webmanifest|xml|toml)$/i,
        use: [{ loader: "file-loader?name=./[name].[ext]" }],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  experiments: {
    asyncWebAssembly: true,
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
};