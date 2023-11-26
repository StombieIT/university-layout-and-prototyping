const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    entry: {
        index: "./src/index.js",
        game: "./src/game.js"
    },
    output: {
        filename: "[name].[hash:10].js",
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".js", ".json"],
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "index.html"),
            filename: "index.html",
            title: "Волейбол",
            chunks: ["index"]
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "public"),
                    to: path.resolve(__dirname, "dist"),
                    filter: resourcePath => !resourcePath.endsWith(".html")
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
            },
            {
                test: /\.html$/,
                use: [
                    'html-loader'
                ]
            }
        ]
    },
    devServer: {
        port: 1337,
        hot: true
    }
}
