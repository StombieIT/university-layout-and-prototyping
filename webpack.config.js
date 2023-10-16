const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    entry: {
        index: "./src/index.js",
        fish: "./src/fish/index.js"
    },
    output: {
        filename: "[name].[hash:10].js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".js"],
        alias: {
            "@utils": path.resolve(__dirname, "src", "utils"),
            "@assets": path.resolve(__dirname, "src", "assets")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "index.html"),
            filename: "index.html",
            title: "Layout and prototyping",
            chunks: ["index"]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "fish", "index.html"),
            filename: "fish/index.html",
            title: "Fish",
            chunks: ["index", "fish"]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "flexbox-brand", "index.html"),
            filename: "flexbox-brand/index.html",
            title: "Flexbox Brand",
            chunks: ["index"]
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "public"),
                    to: path.resolve(__dirname, "dist"),
                    filter: resourcePath=> !resourcePath.endsWith(".html")
                }
            ]
        }),
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    'svg-inline-loader'
                ]
            }
        ]
    },
    devServer: {
        port: 1337,
        hot: true
    }
}
