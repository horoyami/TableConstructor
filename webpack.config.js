const path = require("path");
const postcssNesting = require("postcss-nesting");

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
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      }
    ]
  }
};