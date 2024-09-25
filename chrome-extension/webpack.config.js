const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development', // Change to 'production' for production builds
  entry: {
    contentScript: path.join(__dirname, 'src', 'content', 'index.ts'), // Use .ts as entry point
  },
  output: {
    filename: 'content.js', // Output bundle name
    path: path.resolve(__dirname, 'dist'), // Output directory
    clean: true, // Clean output directory before each build
  },
  module: {
    rules: [
      {
        test: /\.(ts|js|jsx)$/, // Transpile TypeScript, JavaScript, and JSX files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', // For JavaScript
              '@babel/preset-typescript', // For TypeScript
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
    new CleanWebpackPlugin(), // Clean the output directory before each build
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'manifest.json', // Copy the manifest file
          to: path.resolve(__dirname, 'dist'),
          force: true,
        },
        // Add any other files you need to copy (e.g., images, styles)
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Resolve these extensions
  },
  devtool: 'source-map', // Enable source maps for easier debugging
};
