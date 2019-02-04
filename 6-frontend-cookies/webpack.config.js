const HtmlWebPackPlugin = require("html-webpack-plugin")
const path = require("path")
module.exports = {
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    historyApiFallback: true,
    contentBase: path.join(__dirname, "public")
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 30000,
              name: "[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html"
    })
  ],
  output: {
    path: path.join(__dirname, "build")
  },
  entry: {
    javascript: "./src/index.js",
    html: "./public/index.html"
  }
}
