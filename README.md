# Creating a Chrome Extension with React

### step 1: Create React App

> npx create-react-app quote-master --template typescript

### step 2: Add Webpack

> npm install --save-dev webpack webpack-cli copy-webpack-plugin css-loader ts-loader html-webpack-plugin html-webpack-injector ts-node

#### update the Webpack configuration

By default, the create-react-app template does not provide a Webpack configuration file, so we need to create one. Create a new file called `webpack.config.js` in the root directory of your project, and add the following code:

```
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const HTMLWebpackInjector = require('html-webpack-injector');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/index.tsx"
    },
    mode: "production",
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: { noEmit: false },
                        }
                    }
                ],
            },
            {
                exclude: /node_modules/,
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                exclude: /node_modules/,
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "public/*.json", to: "[name][ext]" },
                { from: "public/*.ico", to: "[name][ext]" },
                { from: "public/*.png", to: "./icons/[name][ext]" },
            ],
        }),
        new HTMLWebpackPlugin({
            template: "./public/index.html",
            chunks: ["index"]
        }),
        new HTMLWebpackInjector(),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", "*.png"],
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
        clean: true,
    },
};
```

Now that we have configured webpack, Update your `package.json` file to include the following scripts:

```
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "watch": "webpack -w --config webpack.config.js"
  }
```

These scripts will allow you to build your extension using the npm `run build` command, or to run Webpack in watch mode using the npm `run watch` command.

#### step 3: Add the Manifest file

A manifest file is used to define the metadata and permissions for a Chrome extension. Create a new file called `manifest.json` in the root directory of your project and add the following code:

```
{
  "manifest_version": 3,
  "name": "Quote Master",
  "version": "1.0.0",
  "description": "Display a new English quote every time you open a new tab.",
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "permissions": [
    "storage"
  ],
  "icons": {
    "16": "icons/icon192.png",
    "48": "icons/icon192.png",
    "128": "icons/icon512.png"
  },
  "action": {
    "default_popup": "index.html",
    "default_icon": {
      "16": "icons/icon192.png",
      "48": "icons/icon192.png",
      "128": "icons/icon512.png"
    }
  }
}

```

#### step 4: Build the App

Finally, run the npm run build command in your terminal to build your extension: When script will finish → new /dist folder will be created at the root of our app:

#### step 5: Load the extension

To load your extension into Chrome, open Chrome and navigate to the Extensions page by typing `chrome://extensions` into the address bar. Then, click the "Load unpacked" button and select the dist directory in your project.

---

### How to run it locally, and visit `http://localhost:3000`

```
npm run start
```
