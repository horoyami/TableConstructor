const path = require("path");

module.exports = {
  entry: "./src/plugin.js",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist/",
    library: "Table",
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      }
    ]
  }
};