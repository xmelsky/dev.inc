const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env) => ({
  entry: [ './src/main.js' ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: false
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/webfonts',
          to: 'webfonts',
        },
        {
          from: './src/css',
          to: 'css',
        },
        {
          from: './src/js',
          to: 'js',
          globOptions: {
            ignore: ['**/utils/**'],
          },
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [ new TerserPlugin() ],
  },
});
