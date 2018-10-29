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
        test: /\.css$/,
        use: ["style-loader",
          {loader: 'css-loader', options: {importLoaders: 1}},
          {
            loader: 'postcss-loader', options: {
              ident: 'postcss',
              plugins: () => [
                postcssNesting()
              ]
            }
          }]
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader"
      }
    ]
  }
};