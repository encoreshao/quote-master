const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const HTMLWebpackInjector = require('html-webpack-injector');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const extPlugins = [
    new CopyWebpackPlugin({
        patterns: [
            { from: "src/resources/manifest.json", to: "[name][ext]" },
            { from: "public/*.ico", to: "[name][ext]" },
            { from: "public/privacy.html", to: "[name][ext]" },
            { from: "src/assets/icons/*.png", to: "./icons/[name][ext]" },
        ],
    }),
    new HTMLWebpackPlugin({
        template: "./public/index.html",
        chunks: ["index"]
    }),
    new HTMLWebpackInjector(),
]

module.exports = {
    entry: {
        index: "./src/index.tsx",
        background: "./src/background/index.ts",
        content_scripts: "./src/content_scripts/index.ts",
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
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader"
                ]
            },
            {
                test: /\.svg$/i,
                include: path.join(__dirname, 'src/icons'),
                use: ['@svgr/webpack'],
            },
            {
                exclude: [/node_modules/, /[\\/]src[\\/]icons[\\/]/],
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: extPlugins,
    resolve: {
        extensions: [".tsx", ".ts", ".js", "*.png"],
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
        clean: true,
    },
};
