
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      title: 'Software Map Visualization',
      template: "./src/public/template.html",
      filename: path.resolve("dist", "index.html")
    })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: "/node_modules/",
        use: [
          {
            loader: 'ts-loader'
          },
        ]
      },
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js', '.html' ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080
  },
  devtool: 'source-map'
};