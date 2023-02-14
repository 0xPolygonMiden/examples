const path = require('path');

import MiniCssExtractPlugin, { loader as _loader } from 'mini-css-extract-plugin';
const nodeModulesPath = resolve(__dirname, 'node_modules');


export const entry = './src/index.tsx';
export const module = {
  rules: [
    {
      test: /\.json$/,
      use: 'json-loader',
    },
    {
      test: /\.(js)x?$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    },
    {
      test: /\.(ts)x?$/,
      exclude: /node_modules|\.d\.ts$/,
      use: {
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            noEmit: false, // this option will solve the issue
          },
        },
      },
    },
    {
      test: /\.(scss|css)$/,
      // exclude: /node_modules/,
      use: [
        _loader,
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        // This is needed to help find the KaTeX fonts.
        // https://github.com/bholloway/resolve-url-loader/issues/107
        // https://github.com/bholloway/resolve-url-loader/issues/212
        // https://stackoverflow.com/questions/54042335/webpack-and-fonts-with-relative-paths
        // https://stackoverflow.com/questions/68366936/how-to-bundle-katex-css-from-node-modules-to-a-single-output-css-from-a-sass-us
        'resolve-url-loader',
        {
          loader: "sass-loader",
          options: {
            // This is needed for resolve-url-loader to work!
            // https://github.com/bholloway/resolve-url-loader/issues/212#issuecomment-1011630220
            sourceMap: true,
            sassOptions: {
              includePaths: [nodeModulesPath],
            },
          },
        },
      ],
    },
  ],
};
export const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].css',
  }),
];
export const resolve = {
  extensions: ['.css', '.tsx', '.ts', '.js'],
};
export const output = {
  filename: 'bundle.js',
  path: _resolve(__dirname, 'dist'),
};
