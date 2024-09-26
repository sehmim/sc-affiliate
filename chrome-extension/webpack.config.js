const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');

// Function to generate manifest.json dynamically
function createManifest() {
  const manifest = {
    manifest_version: 3,
    name: "Shop for Good",
    version: "1.7",
    description: "Tracks brands that give you discounts. When You Shop. You Save. Charities and Causes Win.",
    permissions: ["cookies", "storage"],
    action: {
      default_popup: "./popup.html"
    },
    content_scripts: [
      {
        matches: ["http://*/*", "https://*/*"],
        js: ["content.js"],
        css: ["css/index.css"]
      }
    ],
    externally_connectable: {
      matches: ["*://localhost/*", "*://sc-affiliate.vercel.app/*"]
    },
    web_accessible_resources: [
      {
        resources: ["css/index.css"],
        matches: ["http://*/*", "https://*/*"]
      }
    ],
    background: {
      service_worker: "background.js"
    },
    icons: {
      "16": "icons/icon.png",
      "48": "icons/icon.png",
      "128": "icons/icon.png"
    },
    host_permissions: ["*://*.example.com/*"]
  };

  // Write manifest.json to a temporary directory (build/)
  fs.writeFileSync(path.resolve(__dirname, 'build', 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Manifest created successfully in build directory');
}

module.exports = {
  mode: 'development', // Change to 'production' for production builds
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
        { from: 'build/manifest.json', to: 'manifest.json' }, // Copy manifest.json from the build folder
      ],
    }),
    {
      // Webpack hook to create the manifest.json file before the build starts
      apply: (compiler) => {
        compiler.hooks.beforeRun.tap('CreateManifestPlugin', (compilation) => {
          createManifest(); // Call the manifest creation function
        });
      },
    },
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devtool: 'source-map',
};
