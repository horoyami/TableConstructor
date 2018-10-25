const path = require("path");

module.exports = {
    entry: "./src/tableConstructor.js",
    output: {
        filename: "tableConstructor.js",
        path: __dirname,
        library: "TableConstructor",
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.svg$/,
                loader: "svg-inline-loader"
            }
        ]
    }
};