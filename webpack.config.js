const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        index: "./src/index.js"
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
            title: "Layout and prototyping"
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "public"),
                    to: path.resolve(__dirname, "dist"),
                    filter: resourcePath=> !resourcePath.endsWith("index.html")
                }
            ]
        }),
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
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
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
