const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { createManifest } = require('./src/utils/buildHelper');

module.exports = {
  mode: 'production',
  entry: {
    content: path.join(__dirname, 'src', 'content', 'index.ts'),
    background: path.join(__dirname, 'src', 'background', 'background.js'),
    popup: path.join(__dirname, 'src', 'popup', 'popup.js')
  },
  output: {
    filename: '[name].js', // Output based on entry keys (contentScript.js, backgroundScript.js, popup.js)
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean output directory before each build
  },
  module: {
    rules: [
      {
        test: /\.(ts|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean the dist folder before each build
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/popup/popup.html', to: 'popup.html' },
        { from: 'css/index.css', to: 'css/index.css' },
        { from: 'icons', to: 'icons' },
        { from: 'manifest.json', to: 'manifest.json' }, // Copy manifest.json from the build folder
      ],
    }),
    {
      // Webpack hook to create the manifest.json file before the build starts
      apply: (compiler) => {
        compiler.hooks.beforeRun.tapPromise('CreateManifestPlugin', async (compilation) => {
          await createManifest(); // Call the manifest creation function and wait for it to complete
        });
      },
    },
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devtool: 'source-map',
};
